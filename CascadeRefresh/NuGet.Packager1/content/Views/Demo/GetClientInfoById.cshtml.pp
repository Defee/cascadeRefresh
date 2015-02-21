@model $rootnamespace$.Controllers.DemoController.ClientInfo

<div class="row">
    <div class="col-md-3">@Html.LabelFor(m => m.FirstName)</div>

    <div class="col-md-3">@Html.TextBoxFor(m => m.FirstName)</div>
</div>


<div class="row">
    <div class="col-md-3">@Html.LabelFor(m => m.MiddleName)</div>

    <div class="col-md-3">@Html.TextBoxFor(m => m.MiddleName)</div>
</div>

<div class="row">
    <div class="col-md-3">@Html.LabelFor(m => m.LastName)</div>

    <div class="col-md-3">@Html.TextBoxFor(m => m.LastName)</div>
</div>