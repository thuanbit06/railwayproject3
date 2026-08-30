using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using RailAdmin.API.Data;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;

    private IDbContextTransaction? _transaction;

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
    }

    public async Task BeginTransactionAsync()
    {
        if (_transaction != null)
        {
            return;
        }

        _transaction =
            await _db.Database.BeginTransactionAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction == null)
        {
            return;
        }

        await _transaction.CommitAsync();

        await _transaction.DisposeAsync();

        _transaction = null;
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction == null)
        {
            return;
        }

        await _transaction.RollbackAsync();

        await _transaction.DisposeAsync();

        _transaction = null;

        // Xóa trạng thái tracking sau rollback
        _db.ChangeTracker.Clear();
    }
}