namespace RailAdmin.API.Repository.IRepository;

public interface IUnitOfWork
{
    Task BeginTransactionAsync();

    Task SaveChangesAsync();

    Task CommitTransactionAsync();

    Task RollbackTransactionAsync();
}