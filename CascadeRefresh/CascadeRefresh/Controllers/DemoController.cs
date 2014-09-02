using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using CascadeRefresh.Infrastructure.ControllerExtentions;

namespace CascadeRefresh.Controllers
{
    public class DemoController : Controller
    {
        // GET: CascadeRefresh
        public ActionResult Index()
        {
            
            return View(new
            {
                City=1,
                Region=2
            });
        }

        public ActionResult GetRegionJson(int country)
        {
            IList<MyClass> result = new List<MyClass>()
            {

                new MyClass(){Id = 1,Name = "Hong Kong",RelatedToId = 1},
                 new MyClass(){Id = 2,Name = "Makao",RelatedToId = 1},
                 new MyClass(){Id = 3,Name = "Shandong",RelatedToId = 1},
                 new MyClass(){Id = 4,Name = "Texas",RelatedToId = 2},
                 new MyClass(){Id = 5,Name = "Calorado",RelatedToId = 2},
                    new MyClass(){Id = 6,Name = "Moscow Region",RelatedToId = 3},
            };
            return Json(
                new
                {
                    htmlAttributes = new Dictionary<string,object>(),
                    options = from myClass in result where country== myClass.RelatedToId select new { Id = myClass.Id, Name = myClass.Name },
                    defaultValue = "Select Region",
                }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCityJson(int region)
        {
            IList<MyClass> result = new List<MyClass>()
            {
                new MyClass(){Id = 1,Name = "Hong Kong",RelatedToId = 1},
                 new MyClass(){Id = 2,Name = "Makao",RelatedToId = 2},
                 new MyClass(){Id = 3,Name = "Jinan",RelatedToId = 3},
                 new MyClass(){Id = 4,Name = "Huanghekou",RelatedToId = 3},
                 new MyClass(){Id = 5,Name = "Texas",RelatedToId = 4},
                 new MyClass(){Id = 6,Name = "Ostin",RelatedToId = 4},
                 new MyClass(){Id = 7,Name = "Denver",RelatedToId = 5},
                 new MyClass(){Id = 8,Name = "Ostin",RelatedToId = 5},
                 new MyClass(){Id = 9,Name = "Moscow",RelatedToId = 6},
                 new MyClass(){Id = 10,Name = "Sergeev Pasage",RelatedToId = 6},
                 new MyClass(){Id = 11,Name = "Elektrostal",RelatedToId = 6},
            };
            var servObj =new
                {
                    htmlAttributes = new Dictionary<string,object>(),
                    options = from myClass in result where region == myClass.RelatedToId select new { Id = myClass.Id, Name = myClass.Name },
                    defaultValue = "Select City",
                };
            return Json(servObj, JsonRequestBehavior.AllowGet);
        }

        public class ClientInfo
        {
            public int Id { get; set; }

            public string FirstName { get; set; }

            public string LastName { get; set; }

            public string MiddleName { get; set; }

        }
        public ActionResult GetClientInfoByOfferId(int offerNumber)
        {
            switch (offerNumber)
            {
                case 1:
                    return PartialView( new ClientInfo
                    {
                        FirstName = "Alexandr",
                        LastName = "Pirogov",
                        Id = 3,
                        MiddleName = "Leonidovic"
                    });
                case 2:
                    return PartialView(new ClientInfo
                    {
                        FirstName = "Ivan",
                        LastName = "Gerasimenko",
                        Id = 1,
                        MiddleName = "Sergeevich"
                    });
                case 3:
                    return PartialView(new ClientInfo
                    {
                        FirstName = "Jhon",
                        LastName = "Skit",
                        Id = 2,
                        MiddleName = ""
                    });
                default :
                    return PartialView(new ClientInfo());
            }
            
        }


        public ActionResult GetClientInfoById(int id)
        {
            switch (id)
            {
                case 3:
                    return PartialView(new ClientInfo
                    {
                        FirstName = "Alexandr",
                        LastName = "Pirogov",
                        Id = 3,
                        MiddleName = "Leonidovic"
                    });
                case 1:
                    return PartialView(new ClientInfo
                    {
                        FirstName = "Ivan",
                        LastName = "Gerasimenko",
                        Id = 1,
                        MiddleName = "Sergeevich"
                    });
                case 2:
                    return PartialView(new ClientInfo
                    {
                        FirstName = "Jhon",
                        LastName = "Skit",
                        Id = 2,
                        MiddleName = ""
                    });
                default:
                    return PartialView(new ClientInfo());
            }
        }

        public ActionResult GetPreferableProduct(int product)
        {
            switch (product)
            {
                case 1:
                    ViewBag.Selection = "Books";
                    return PartialView();
                case 2:
                    ViewBag.Selection = "Movies";
                    return PartialView();
                case 3:
                    ViewBag.Selection = "Shoes";
                    return PartialView();
                default:
                    ViewBag.Selection = "Nothing";
                    return PartialView();
            }
        }

        public ActionResult GetRegionJsonp(int country1)
        {
            IList<MyClass> result = new List<MyClass>()
            {

                new MyClass(){Id = 1,Name = "Hong Kong",RelatedToId = 1},
                 new MyClass(){Id = 2,Name = "Makao",RelatedToId = 1},
                 new MyClass(){Id = 3,Name = "Shandong",RelatedToId = 1},
                 new MyClass(){Id = 4,Name = "Texas",RelatedToId = 2},
                 new MyClass(){Id = 5,Name = "Calorado",RelatedToId = 2},
                    new MyClass(){Id = 6,Name = "Moscow Region",RelatedToId = 3},
            };
            return this.Jsonp(
                new
                {
                    htmlAttributes = new Dictionary<string, object>(),
                    options = from myClass in result where country1 == myClass.RelatedToId select new { Id = myClass.Id, Name = myClass.Name },
                    defaultValue = "Select Region",
                }, behavior: JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCityJsonp(int region1)
        {
            IList<MyClass> result = new List<MyClass>()
            {
                new MyClass(){Id = 1,Name = "Hong Kong",RelatedToId = 1},
                 new MyClass(){Id = 2,Name = "Makao",RelatedToId = 2},
                 new MyClass(){Id = 3,Name = "Jinan",RelatedToId = 3},
                 new MyClass(){Id = 4,Name = "Huanghekou",RelatedToId = 3},
                 new MyClass(){Id = 5,Name = "Texas",RelatedToId = 4},
                 new MyClass(){Id = 6,Name = "Ostin",RelatedToId = 4},
                 new MyClass(){Id = 7,Name = "Denver",RelatedToId = 5},
                 new MyClass(){Id = 8,Name = "Ostin",RelatedToId = 5},
                 new MyClass(){Id = 9,Name = "Moscow",RelatedToId = 6},
                 new MyClass(){Id = 10,Name = "Sergeev Pasage",RelatedToId = 6},
                 new MyClass(){Id = 11,Name = "Elektrostal",RelatedToId = 6},
            };
            return this.Jsonp(
                new
                {
                    htmlAttributes = new Dictionary<string, object>(),
                    options = from myClass in result where region1 == myClass.RelatedToId select new { Id = myClass.Id, Name = myClass.Name },
                    defaultValue = "Select City",
                }, behavior: JsonRequestBehavior.AllowGet);
        }
    }

    public class MyClass
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int RelatedToId { get; set; }
    }
}