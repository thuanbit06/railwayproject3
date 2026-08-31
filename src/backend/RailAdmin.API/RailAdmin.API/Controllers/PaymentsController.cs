using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Payment;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var payments = await _paymentService.GetAllAsync();

        return Ok(payments);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var payment = await _paymentService.GetByIdAsync(id);

        if (payment == null)
            return NotFound(new
            {
                message = $"Payment with ID {id} was not found."
            });

        return Ok(payment);
    }

    // =========================================================
    // GET BY PNR
    // =========================================================

    [HttpGet("pnr/{pnr}")]
    public async Task<IActionResult> GetByPNR(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        var payment = await _paymentService.GetByPNRAsync(pnr.Trim());

        if (payment == null)
        {
            return NotFound(new
            {
                message = $"Payment for PNR '{pnr}' was not found."
            });
        }

        return Ok(payment);
    }

    // =========================================================
    // CREATE
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] PaymentCreateRequest dto)
    {
        try
        {
            var payment = await _paymentService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = payment.Id },
                payment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] PaymentUpdateRequest dto)
    {
        try
        {
            var result =
                await _paymentService.UpdateAsync(id, dto);

            if (!result)
            {
                return NotFound(new
                {
                    message = $"Payment with ID {id} was not found."
                });
            }

            var payment =
                await _paymentService.GetByIdAsync(id);

            return Ok(payment);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // DELETE
    // =========================================================

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result =
            await _paymentService.DeleteAsync(id);

        if (!result)
        {
            return NotFound(new
            {
                message = $"Payment with ID {id} was not found."
            });
        }

        return Ok(new
        {
            message = "Payment deleted successfully."
        });
    }
    // =========================================================
    // REFUND
    // PUT: api/payments/pnr/{pnr}/refund
    // =========================================================

    [HttpPut("pnr/{pnr}/refund")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Refund(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        try
        {
            var result =
                await _paymentService
                    .RefundAsync(pnr.Trim());

            if (!result)
            {
                return NotFound(new
                {
                    message =
                        $"Payment for PNR '{pnr}' was not found."
                });
            }

            var payment =
                await _paymentService
                    .GetByPNRAsync(pnr.Trim());

            return Ok(payment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
}