@using $rootnamespace$.Controllers
@using $rootnamespace$.Infrastructure.HelperExtentions
@model DemoController.ClientInfo


<div class="row">
    <div class="col-md-3">@Html.LabelFor(m => m.Id)</div>

    <div class="col-md-3">@Html.TextBoxFor(m => m.Id).CascadeRefresh(new CascadeOptions()
                          {
                              RefreshTargetsAsSelectors = true,
                              RefreshTargets = "#ClientNameWrapper"
                          })</div>
</div>


<div id="ClientNameWrapper" data-url="@Url.Action("GetClientInfoById","Demo")" data-dependent-on="#Id">
    @Html.Partial("GetClientInfoById",Model)
</div>

<div class="row">
    <div class="col-md-3">@Html.Label("Product_lb","Preferable product")</div>

    <div class="col-md-3">@Html.DropDownList("Product",new SelectList(new List<MyClass>
                          {
                              new MyClass{Id=1,Name="Books"},
                              new MyClass{Id=2,Name="Videos"},
                              new MyClass{Id=3,Name="Shoes"}
                          },"Id","Name"),"Select product").CascadeRefresh(new CascadeOptions()
                          {
                              RefreshTargetsAsSelectors = true,
                              RefreshTargets = "#PreferableProductWrapper"
                          })</div>
</div>

<div id="PreferableProductWrapper" data-url="@Url.Action("GetPreferableProduct","Demo")" data-dependent-on="#Product"></div>