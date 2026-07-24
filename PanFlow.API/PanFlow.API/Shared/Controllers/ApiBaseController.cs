using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PanFlow.API.Shared.Controller
{
    [ApiController]
    public class ApiBaseController : ControllerBase
    {
        protected string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }
}
