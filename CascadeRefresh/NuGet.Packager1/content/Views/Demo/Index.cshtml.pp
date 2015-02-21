@using $rootnamespace$.Infrastructure.HelperExtentions
@model dynamic
@{
    ViewBag.Title = "CascadeRefresh";

}
@section css
{
    @Styles.Render("~/Content/snippet");
}
@section scripts
{
    @Scripts.Render("~/bundles/cascadeRefresh")
    @Scripts.Render("~/bundles/snippet")
    <script>
        $(document).ready(function () {
            $("pre.csharp").snippet("csharp", { style: "ide-msvcpp" }
                );
            $("pre.html").snippet("html", { style: "rand01" }
                );

            @*$.ajax({
                url: 'http://hilite.me/api',
                data: {
                    code: '@Html.Raw("public class MyClass"+
                        "{"+
                           " public int Id { get; set; }"+
                            "public string Name { get; set; }"+
                            "public int RelatedToId { get; set; }"+
                        "}")',
                    lexer: 'C#',
            //options: '',
             style:  'vs',
             linenos: true
             //divstyles: CSS style to use in the wrapping <div> element, can be empty
                },
                crossDomain:true
            }).done(function (data) {
                console.log(data);
                $('#MyClassCode').html(data);
            });*@
        })
    </script>
}
<h2>Cascade Refresh and Element refresh plugins</h2>

<div class="row">
    <div class="col-md-12">
        <h2>Examples:Simple use</h2>

    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <h3>General configuration for raw html + javascript</h3>
        <div class="row">
            <div class="col-md-12">
                <h5>Firts you include the plugin scripts:</h5>

                <pre class="html">
@("<script src=\"~/Scripts/elementRefresh.js\" type=\"text/javascript\"></script> ")
@("<script src=\"~/Scripts/cascadeRefresh.js.js\" type=\"text/javascript\"></script>")</pre>
                <h5> Then you configure your makrup element wich must refresh others:</h5>
                <h6>Note: You must specify name on all dependencies</h6>
                <pre class="html">
@("<select data-cascade=\"true\" name=\"Country\" data-refresh-targets=\"#Region\">")
    @("<option value>Select Country</option>")
    @("<option value=\"2\">USA</option>")
    @("<option value=\"1\">China</option>")
    @("<option value=\"3\">Russia</option>")
@("</select>")</pre>
                <h5> Than you configure refreshing element:</h5>
                <ul>
                    <li>
                        <h5> If it is a wrapper:</h5>
                        <pre class="html">
@("<div id=\"Region\" data-url=\"/Demo/GetRegionHtml\" data-dependent-on=\"#Country\"></div>")
</pre>
                    </li>
                    <li>
                        <h5> If it is a select:</h5>
                        <pre class="html">
@("<select id=\"Region\" data-cascade=\"true\" name=\"Region\" data-url=\"/Demo/GetRegionJson\""+
  "data-datatype=\"json\" data-dependent-on=\"#Country\" data-refresh-targets=\"#City\""+
  "data-select-full-attributed=\"true\"></select>")
</pre>

                    </li>
                </ul>
            </div>

        </div>
    </div>
    <div class="col-md-12">
        <h3>Example with dataType json on selects</h3>
        <div class="row">
            <div class="col-md-12">
                <h5>So lets dig a bit deeper</h5>
                When You specify <i>data-datatype="json" </i> you change the server response type from html(as default) to json.<br />
                When You specify <i>data-select-full-attributed="true"</i> your server object must be something like this:

                <pre class="csharp">
var servObj =new
        {
            @("htmlAttributes = new Dictionary<string,object>()"),
            options = from myClass in result where region == myClass.RelatedToId select new { Id = myClass.Id, Name = myClass.Name },
            defaultValue = "Select City",
        };
</pre>
                if you dont specify the <i>data-select-full-attributed</i> attribute
                the object will be the simple dictionary
                <pre class="csharp">
var servObj = @("new Dictionary<string,object>()");
</pre>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <select id="Country" data-cascade="true" name="Country" data-refresh-targets="#Region">
                <option value>Select Country</option>
                <option value="2">USA</option>
                <option value="1">China</option>
                <option value="3">Russia</option>
            </select>
            <select id="Region" data-cascade="true" name="Region" data-url="@Url.Action("GetRegionJson")"
                    data-datatype="json" data-dependent-on="#Country" data-refresh-targets="#City"
                    data-select-full-attributed="true"></select>
            <select id="City" data-cascade="true" name="City" data-url="@Url.Action("GetCityJson")"
                    data-datatype="json" data-dependent-on="#Region"
                    data-select-full-attributed="true"></select>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <h3>Example with html partial views</h3>
        <h4>You could enter 1,2,3 in texbox to see how version with wrappers work:</h4>
        <div class="row">
            <div class="col-md-3">Offer Number</div>
            <div class="col-md-3">
                @Html.TextBox("offerNumber").CascadeRefresh(new CascadeOptions()
                    {
                        RefreshTargetsAsSelectors = true,
                        RefreshTargets = "#ClientInfoWrapper"
                    })
            </div>
        </div>

        <div id="ClientInfoWrapper" data-url="@Url.Action("GetClientInfoByOfferId","Demo")" data-dependent-on="#offerNumber"></div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <h3>Example with dataType jsonp on selects</h3>
        <h4><b>Notice:</b> If you use the Jsonp format for the response type, your server should be configured to give a jsonp formated response</h4>
        <div class="row">
            <div class="col-md-12">
                <select id="Country1" data-cascade="true" name="Country1" data-refresh-targets="#Region1">
                    <option value>Select Country</option>
                    <option value="2">USA</option>
                    <option value="1">China</option>
                    <option value="3">Russia</option>
                </select>
                <select id="Region1" data-cascade="true" name="Region1" data-url="@Url.Action("GetRegionJsonp")"
                        data-datatype="jsonp" data-dependent-on="#Country1" data-refresh-targets="#City1"
                        data-select-full-attributed="true"></select>
                <select id="City1" data-cascade="true" name="City1" data-url="@Url.Action("GetCityJsonp")"
                        data-datatype="jsonp" data-dependent-on="#Region1"
                        data-select-full-attributed="true"></select>
            </div>
        </div>
    </div>
</div>


