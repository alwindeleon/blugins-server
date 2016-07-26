$(function () {
    
    $('#container1').highcharts({
        title: {
            text: 'Tasks Done Per Hour',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            title: {
                text: 'Hour(military time)'
            }
        },
        yAxis: {
            title: {
                text: 'Tasks Done'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'tasks'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tasks Done',
            data: numTasksPerHour
        }]
    });
    
    $('#container2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Tasks Done Breakdown'
        },
        subtitle: {
            text: 'Source: Database'
        },
        xAxis: {
            categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            crosshair: true,
            title:{
                text: 'Hour(military time)'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Tasks Done of each Member'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:8px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}  </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'JC',
            data: jc

        }, {
            name: 'Jo-en',
            data: joen

        }, {
            name: 'Ron',
            data: ron

        }, {
            name: 'Blu',
            data: blu

        }]
    });
    
     $('#container3').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Total Tasks Done of each Member'
        },
        subtitle: {
            text: 'Source: Database'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'tasks done'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: ' <b>{point.y} tasks</b>'
        },
        series: [{
            name: 'Members',
            data: [
                ['Ronryan', ronTotal],
                ['JC', jcTotal],
                ['Jo-en', joenTotal],
                ['Blu', bluTotal]
              
            ],
            dataLabels: {
                enabled: false,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
    
     $('#container4').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Types of Tasks Done'
        },
        xAxis: {
            categories:  ["Website Update", "Fulfillment Client Email", "Client Call","Corporate Governance Hotline","Fulfillment SR Query","Request Cancel Quote","Billing Issue Investigation"]
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Tasks Done on each Type of Activity'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'JC',
            data: jcType
        }, {
            name: 'Ronryan',
            data: ronType
        }, {
            name: 'Jo-en',
            data: joenType
        },
        {
            name: 'Blu',
            data: [0,0,0,0,0,0,0]
        }]
    });
});