am4core.ready(function() {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

    var chart = am4core.create("chartdiv1", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [{}];

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.fontSize = 11;
    categoryAxis.renderer.labels.template.rotation = 270;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    // valueAxis.max = 24000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 20;
// axis break
    var axisBreak = valueAxis.axisBreaks.create();
    axisBreak.startValue = 10000;
    axisBreak.endValue = 30000;
    axisBreak.breakSize = 0.05;

// make break expand on hover
    var hoverState = axisBreak.states.create("hover");
    hoverState.properties.breakSize = 1;
    hoverState.properties.opacity = 0.1;
    hoverState.transitionDuration = 1500;

    axisBreak.defaultState.transitionDuration = 1000;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "date";
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "total";
    series.columns.template.tooltipText = "{valueY.value}";
    series.columns.template.tooltipY = 0;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
    series.columns.template.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });

    //tunes
    //chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();

    axios.post('/report', {
    })
        .then(function (response) {
            console.log(response);
            if(response){
                chart.data = response.data;
            }
            else{
                alert(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}); // end am4core.ready()
