using System.Text;
using System.Web.Mvc;
using CascadeRefresh.Infrastructure.CustomActionResults;

namespace CascadeRefresh.Infrastructure.ControllerExtentions
{
    public static class ControllerExtentions
    {
        public static JsonpResult Jsonp(this Controller controller, object data, string contentType=null,JsonRequestBehavior behavior =JsonRequestBehavior.DenyGet, Encoding contentEncoding=null)
        {
            return new JsonpResult
            {
                JsonRequestBehavior = behavior,
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding
            };
        }
    }

}