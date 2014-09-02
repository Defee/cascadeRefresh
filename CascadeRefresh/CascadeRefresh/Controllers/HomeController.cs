using System.Web.Mvc;
using CascadeRefresh.Resources;

namespace CascadeRefresh.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            ViewBag.Title = "Компания " + Brand.BrandName + ":Разработка сайтов, порталов, систем документооборота";

            return View();
        }

        public ActionResult Api()
        {
            ViewBag.Title = "Plugin " + Brand.PluginName +" api";
            ViewBag.Message = "Plugin " + Brand.PluginName + " api";

            return View();
        }

        public ActionResult Contact()
        {

            ViewBag.Title = "Контакты " + Brand.BrandName;
            //ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}