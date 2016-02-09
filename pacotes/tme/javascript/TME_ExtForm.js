/*
 * SOFTWARE NAME: Thematic Mapping Engine
 * SOFTWARE RELEASE: 1.6
 * COPYRIGHT NOTICE: Copyright (C) 2008 Bjorn Sandvik,
 *                   bjorn@thematicmapping.org
 * SOFTWARE LICENSE: GNU General Public License version 3 (GPLv3)
 * NOTICE: >
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of version 3 of the GNU General
 *  Public License as published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *  http://www.gnu.org/licenses/
 *
 */


// Load Google Earth API
google.load("earth", "1");

// Define namespaces for Thematic Mapping Engine (TME)
// Encapsulate all variables and methods in one global object
Ext.namespace('TME');


// Variables for Google Earth API
TME.google = {
    earth: null,  // Google Earth instance
    baseURL: 'http://localhost/thematicmapping/tme/', // Local URL
    networkLink: null // Link to KMZ file
}

// Various data stores used by form fields
TME.data = {

    // Indicator store (loaded from server)
    indicators: new Ext.data.JsonStore({
        url: 'TME_FormHandler.php',
        baseParams: {task: 'indicators'},
        root: 'indicators',
        fields: ['id', 'name', 'description', 'source'],
        autoLoad: true
    }),

    // Year store (loaded from server when indicator is selected)
    years:  new Ext.data.JsonStore({
        url: 'TME_FormHandler.php',
        baseParams: {task:'indYears'},
        root: 'years',
        fields: ['year']
    }),

    // Proportional symbol: Images
    images: [
        ['circle', 'Circle'],
        ['square', 'Square']
    ],

    // Proportional symbol: Regular polygons
    polygons: [
        ['circle', 'Circle'],
        ['square', 'Square']
    ],

    // Proportional symbol: 3d objects
    colladas: [
        ['dome', 'Dome'],
        ['sphere', 'Sphere'],
        ['cube', 'Cube']
    ],


    shapeStore: new Ext.data.SimpleStore({
        fields: ['id', 'name'],
        data: []
    })


}


// All form fields
TME.field = {

    // Thematic mapping technique: Prism Radio
    prism: {
        xtype: 'radio',
        boxLabel: 'Prism',
        hideLabel: true,
        name: 'mapType',
        inputValue: 'prism',
        checked: false,
        listeners: {focus:{fn:function(field) {
            TME.field.hideField(TME.field.barSize);
            TME.field.symbolShape.allowBlank = true;
            TME.fieldset.symbolStyle.hide();
            TME.fieldset.prismStyle.show();
            TME.field.showField(TME.field.colourScale);
            TME.field.showField(TME.field.singleColour);
        }}}
    },

    choropleth: {
        xtype: 'radio',
        boxLabel: 'Choropleth',
        hideLabel: true,
        name: 'mapType',
        inputValue: 'choropleth',
        checked: true,
        listeners: {focus:{fn:function(field) {
            TME.field.symbolShape.allowBlank = true;
            TME.fieldset.symbolStyle.hide();
            TME.fieldset.prismStyle.hide();
            TME.field.colourScale.setValue(true);
            TME.field.hideField(TME.field.colourScale);
            TME.field.hideField(TME.field.singleColour);
            TME.field.hideField(TME.field.colour);
            TME.field.showField(TME.field.startColour);
            TME.field.showField(TME.field.endColour);
            TME.field.showLegend.enable();
        }}}
    },

    bar: new Ext.form.Radio({
        xtype: 'radio',
        boxLabel: 'Bar',
        hideLabel: true,
        name: 'mapType',
        inputValue: 'bar',
        checked: false,
        listeners: {focus:{fn:function(field) {
            TME.field.showField(TME.field.barSize);
            TME.field.symbolShape.allowBlank = true;
            TME.fieldset.symbolStyle.hide();
            TME.fieldset.prismStyle.show();
            TME.field.showField(TME.field.colourScale);
            TME.field.showField(TME.field.singleColour);
        }}}
    }),

    // Thematic mapping technique: Proportional symbol Radio
    symbol: new Ext.form.Radio({
        boxLabel: 'Proportional symbol',
        hideLabel: true,
        name: 'mapType',
        inputValue: 'symbol',
        checked: false,
        listeners: {focus:{fn:function(field) {
            TME.fieldset.prismStyle.hide();
            TME.fieldset.symbolStyle.show();
            TME.field.symbolShape.allowBlank = false;
            TME.field.showField(TME.field.colourScale);
            TME.field.showField(TME.field.singleColour);
        }}}
    }),

    // Indicator ComboBox
    indicator: {
        xtype: 'combo',
        fieldLabel: 'Indicator',
        hiddenName: 'indicator',
        store: TME.data.indicators,
        valueField: 'id',
        displayField: 'name',
        editable: true,
        forceSelection: true,
        mode: 'local',
        triggerAction: 'all',
        anchor:'94%',
        allowBlank: false,
        emptyText: 'Select an indicator...',
        listeners: {select:{fn:function(combo, record, index) {
            // Set default title, description and source
            TME.field.mapTitle.setValue(record.data.name);
            TME.field.mapTitle.setDisabled(false);
            TME.field.mapDescription.setValue(record.data.description);
            TME.field.mapDescription.setDisabled(false);
            TME.field.mapSource.setValue('Statistics from ' + record.data.source);
            TME.field.mapSource.setDisabled(false);

            // Load available years
            TME.field.year.setValue('');
            TME.field.year.setDisabled(false);
            TME.field.year.store.reload({
                params: { id: combo.getValue() }
            });

            // Buttons are disables before year is selected
            TME.button.submit.disable();
            TME.button.preview.disable();
        }}}
    },

    // Year ComboBox
    year: new Ext.form.ComboBox({
        fieldLabel: 'Year',
        hiddenName: 'year',
        store: TME.data.years,
        valueField: 'year',
        displayField: 'year',
        editable: true,
        forceSelection: true,
        mode: 'local',
        triggerAction: 'all',
        anchor: '55%',
        allowBlank: false,
        emptyText: 'Select year...',
        disabled: true,
        listeners: {select:{fn:function(combo, value) {
            TME.button.submit.enable();
            TME.button.preview.enable();
        }}}
    }),

    // Proportional symbol: Image
    imageSymbol: {
        xtype: 'radio',
        boxLabel: 'Image',
        hideLabel: true,
        checked: true,
        name: 'symbolType',
        inputValue: 'image',
        listeners: {focus:{fn:function(field) {
            TME.field.symbolShape.reset();
            TME.data.shapeStore.removeAll();
            TME.data.shapeStore.loadData( TME.data.images );
        }}}
    },

    // Proportional symbol: Regular polygon
    polygonSymbol: {
        xtype: 'radio',
        boxLabel: 'Regular polygon',
        hideLabel: true,
        checked: false,
        name: 'symbolType',
        inputValue: 'polygon',
        listeners: {focus:{fn:function(field) {
            TME.field.symbolShape.reset();
            TME.data.shapeStore.removeAll();
            TME.data.shapeStore.loadData( TME.data.polygons );
        }}}
    },

    // Proportional symbol: 3D object
    colladaSymbol: {
        xtype: 'radio',
        boxLabel: 'Collada (3d)',
        hideLabel: true,
        checked: false,
        name: 'symbolType',
        inputValue: 'collada',
        listeners: {focus:{fn:function(field) {
            TME.field.symbolShape.reset();
            TME.data.shapeStore.removeAll();
            TME.data.shapeStore.loadData( TME.data.colladas );
        }}}
    },

    // Proportional symbol: shape
    symbolShape: new Ext.form.ComboBox({
        fieldLabel: 'Shape',
        hiddenName: 'symbolShape',
        store: TME.data.shapeStore,
        valueField: 'id',
        displayField: 'name',
        emptyText: 'Select shape...',
        editable: false,
        forceSelection: true,
        mode: 'local',
        triggerAction: 'all',
        anchor:'94%'
    }),

    barSize: new Ext.form.NumberField({
        xtype: 'numberfield',
        fieldLabel: 'Bar radius',
        name: 'barSize',
        value: 50000,
        width: 77,
        allowDecimals: false,
        allowNegative: false,
        allowBlank: false
    }),

    // Max sixe NumberField
    size: new Ext.form.NumberField({
        xtype: 'numberfield',
        fieldLabel: 'Max size',
        name: 'symbolMaxSize',
        value: '5',
        width: 30,
        allowDecimals: false,
        allowNegative: false,
        allowBlank: false
    }),

    // Max height NumberField
    maxHeight: new Ext.form.NumberField({
        fieldLabel: 'Max height',
        name: 'maxHeight',
        value: '2000000',
        width: 80,
        allowDecimals: false,
        allowNegative: false,
        allowBlank: false
    }),

    // Map title TextFiled
    mapTitle: new Ext.form.TextField({
        fieldLabel: 'Title',
        name: 'title',
        allowBlank: false
    }),

    // Map description TextField
    mapDescription: new Ext.form.TextArea({
        fieldLabel: 'Description',
        name: 'description'
    }),

    // Map source TextField
    mapSource: new Ext.form.TextField({
        fieldLabel: 'Source',
        name: 'source',
        allowBlank: false
    }),


    colourScale: new Ext.form.Radio({
        boxLabel: 'Colour scale',
        hideLabel: true,
        name: 'colourType',
        inputValue: 'scale',
        checked: true,
        listeners: {focus:{fn:function(field) {
            TME.field.hideField(TME.field.colour);
            TME.field.showField(TME.field.startColour);
            TME.field.showField(TME.field.endColour);
            TME.field.showLegend.enable();
            TME.classification.show();
        }}}
    }),

    singleColour: new Ext.form.Radio({
        boxLabel: 'Single colour',
        hideLabel: true,
        name: 'colourType',
        inputValue: 'single',
        checked: false,
        listeners: {focus:{fn:function(field) {
            TME.field.showField(TME.field.colour);
            TME.field.hideField(TME.field.startColour);
            TME.field.hideField(TME.field.endColour);
            TME.field.showLegend.disable();
            TME.classification.hide();
        }}}
    }),

    // Colour ColorField (extension)
    colour: new Ext.form.ColorField({
	   fieldLabel: 'Colour',
	   name: 'colour',
	   defaultColor: 'FF6600',
       width: 80,
	   showHexValue: false
    }),

    // Start colour ColorField (extension)
    startColour: new Ext.form.ColorField({
	   fieldLabel: 'Start colour',
	   name: 'startColour',
	   defaultColor: 'FFFF99',
       anchor:'90%',
	   showHexValue: false
    }),

    // End colour ColorField (extension)
    endColour: new Ext.form.ColorField({
	   fieldLabel: 'End colour',
	   name: 'endColour',
	   defaultColor: 'FF6600',
       anchor:'90%',
	   showHexValue: false
    }),

    // No data colour ColorField (extension)
    noDataColour: new Ext.form.ColorField({
	   fieldLabel: 'No value',
	   name: 'noDataColour',
	   defaultColor: 'C0C0C0',
       anchor:'90%',
	   showHexValue: false
    }),

    // Classification: Unclassed
    unclassed: new Ext.form.Radio({
        boxLabel: 'Unclassed',
        hideLabel: true,
        name: 'classification',
        inputValue: 'unclassed',
        checked: true,
        listeners: {focus:{fn:function(field) {
            TME.field.hideField(TME.field.numClasses);
        }}}
    }),

    // Classification: Equal interval
    equalInterval: new Ext.form.Radio({
        boxLabel: 'Equal intervals',
        hideLabel: true,
        name: 'classification',
        inputValue: 'equal',
        checked: false,
        listeners: {focus:{fn:function(field) {
            TME.field.showField(TME.field.numClasses);
        }}}
    }),

    // Classification: Quantiles
    quantile: new Ext.form.Radio({
        boxLabel: 'Quantiles',
        hideLabel: true,
        name: 'classification',
        inputValue: 'quantile',
        checked: false,
        listeners: {focus:{fn:function(field) {
            TME.field.showField(TME.field.numClasses);
        }}}
    }),

    // Number of classes
    numClasses: new Ext.form.NumberField({
        fieldLabel: 'Classes',
        name: 'numClasses',
        value: 5,
        maxValue: 9,
        minValue: 2,
        width: 22,
        allowDecimals: false,
        allowBlank: false
    }),

    // Time: One year
    singleYear: {
        xtype: 'radio',
        boxLabel: 'Single year',
        hideLabel: true,
        name: 'timeType',
        inputValue: 'year',
        checked: true,
        listeners: {focus:{fn:function(field) {
            TME.field.quantile.enable();
            if (TME.field.year.value) {
                TME.button.preview.enable();
            }
        }}}
    },

    // Time: Time series
    timeSeries: {
        xtype: 'radio',
        boxLabel: 'Time series',
        hideLabel: true,
        name: 'timeType',
        inputValue: 'series',
        checked: false,
        listeners: {focus:{fn:function(field) {
            if (TME.field.quantile.getValue()) { // Not valid for time series
                TME.field.equalInterval.setValue(true);
            }
            TME.field.quantile.disable();
            TME.button.preview.disable();
        }}}
    },

    // Time: Time slider
    timeSlider: {
        xtype: 'radio',
        boxLabel: 'Time slider',
        hideLabel: true,
        name: 'timeType',
        inputValue: 'slider',
        checked: false,
        listeners: {focus:{fn:function(field) {
            if (TME.field.quantile.getValue()) { // Not valid for time series
                TME.field.equalInterval.setValue(true);
            }
            TME.field.quantile.disable();
            TME.button.preview.disable();
        }}}
    },

    // Show title
    showTitle: new Ext.form.Checkbox({
        boxLabel: 'Show title & source',
        hideLabel: true,
        checked: true,
        name: 'showTitle'
    }),

    // Show legend
    showLegend: new Ext.form.Checkbox({
        boxLabel: 'Show colour legend',
        hideLabel: true,
        checked: true,
        name: 'showLegend'
    }),

    // Show values
    showValues: new Ext.form.Checkbox({
        boxLabel: 'Show values',
        hideLabel: true,
        name: 'showValues'
    }),

    // Show names
    showNames: new Ext.form.Checkbox({
        boxLabel: 'Show names',
        hideLabel: true,
        name: 'showNames'
    }),

    // Max height NumberField
    opacity: new Ext.form.NumberField({
        fieldLabel: 'Opacity',
        name: 'opacity',
        value: 90,
        maxValue: 100,
        width: 80,
        allowDecimals: false,
        allowNegative: false,
        allowBlank: false
    }),



    // METHODS

    // Hide form field
    hideField: function(field){
      field.hide();
      field.getEl().up('.x-form-item').setDisplayed(false); // hide label
    },

    // Show form field
    showField: function(field){
      field.show();
      field.getEl().up('.x-form-item').setDisplayed(true);// show label
    }

}

// Classification FieldSet
TME.classification = new Ext.form.FieldSet({
    title: 'Classification',
    collapsible: false,
    autoHeight: true,
    labelWidth: 65,
    style: 'margin-top: 10px',
    items: [{
        layout: 'column',
        defaults: {layout: 'form'},
        items:[
            {items: [TME.field.unclassed, TME.field.numClasses], columnWidth: .32},
            {items: [TME.field.equalInterval], columnWidth: .4},
            {items: [TME.field.quantile], columnWidth: .28}
        ]
    }]
});


// Grouping fields in fieldsets
TME.fieldset = {

    // Symbol fieldset (column)
    technique: new Ext.form.FieldSet({
        title: 'Technique',
        collapsible: false,
        autoHeight: true,
        labelWidth: 65,
        items: [{
            layout: 'column',
            defaults: {layout: 'form'},
            items:[
                {items: [TME.field.choropleth], columnWidth: .27},
                {items: [TME.field.prism], columnWidth: .19},
                {items: [TME.field.bar], columnWidth: .17},
                {items: [TME.field.symbol], columnWidth: .37}
            ]
        }]
    }),

    // Statistics FieldSet (title, description source)
    statistics: new Ext.form.FieldSet({
        title: 'Statistics',
        collapsible: false,
        autoHeight: true,
        items: [
            TME.field.indicator,
            TME.field.year
        ]
    }),

    // Description FieldSet (title, description source)
    description: new Ext.form.FieldSet({
        title: 'Map description',
        collapsible: true,
        autoHeight: true,
        collapsed: true,
        defaults: {anchor: '94%', disabled: true},
        items: [
            TME.field.mapTitle,
            TME.field.mapDescription,
            TME.field.mapSource
        ]
    }),

    // Prism style FieldSet
    prismStyle: new Ext.form.FieldSet({
        title: 'Prism / bar style',
        collapsible: true,
        autoHeight: true,
        items: [
            {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                    TME.field.maxHeight
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                    TME.field.barSize
                ]
            }]
        }]
    }),

    // Symbol style FieldSet
    symbolStyle: new Ext.form.FieldSet({
        title: 'Symbol style',
        collapsible: true,
        autoHeight: true,
        items: [
            {
                layout: 'column',
                style: 'padding-bottom: 10px',
                defaults: {layout: 'form'},
                items:[
                    {items: [TME.field.imageSymbol], columnWidth: .3},
                    {items: [TME.field.polygonSymbol], columnWidth: .4},
                    {items: [TME.field.colladaSymbol], columnWidth: .3}
                ]
            },
            TME.field.symbolShape,
            {
                layout: 'column',
                defaults: {layout: 'form'},
                items:[
                    {items: [TME.field.size], columnWidth: .5}
                ]
            }
        ]
    }),



    // Colour FieldSet
    colours: new Ext.form.FieldSet({
        title: 'Colours',
        collapsible: true,
        autoHeight: true,
        style: 'padding-bottom: 0px',
        items: [{
            layout: 'column',
            style: 'padding-bottom: 10px',
            defaults: {layout: 'form'},
            items:[
                {items: [TME.field.colourScale], columnWidth: .5},
                {items: [TME.field.singleColour], columnWidth: .5}
            ]
        },

            {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                    TME.field.colour,
                    TME.field.startColour,
                    TME.field.endColour
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                    TME.field.noDataColour,
                    TME.field.opacity
                ]
            }
            ]
        }, TME.classification
        ]
    }),

    // Time FieldSet
    time: new Ext.form.FieldSet({
        title: 'Time',
        collapsible: true,
        autoHeight: true,
        labelWidth: 65,
        items: [{
            layout: 'column',
            defaults: {layout: 'form'},
            items:[
                {items: [TME.field.singleYear], columnWidth: .35},
                {items: [TME.field.timeSeries], columnWidth: .35},
                {items: [TME.field.timeSlider], columnWidth: .30}
            ]
        }]
    }),


    // Display FieldSet
    display: new Ext.form.FieldSet({
        title: 'Display',
        collapsible: true,
        collapsed: false,
        autoHeight: true,
        labelWidth: 65,
        items: [
            {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [
                    TME.field.showTitle,
                    TME.field.showLegend
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [
                    TME.field.showValues,
                    TME.field.showNames
                ]
            }]
        }]
    })

}

TME.engine = new Ext.FormPanel({
    labelWidth: 70,
    frame: true,
    bodyStyle: 'padding:10px 10px 0',
    width: 400,
    items: [
        TME.fieldset.statistics,
        TME.fieldset.technique,
        TME.fieldset.symbolStyle,
        TME.fieldset.prismStyle,
        TME.fieldset.colours,
        TME.fieldset.time,
        TME.fieldset.display,
        TME.fieldset.description
    ]
});

// Form buttons
TME.button = {

    // Preview button
    preview: TME.engine.addButton({
        text: 'Preview *',
        disabled: true,
        handler: function(){
            TME.engine.form.submit({
                url:'TME_FormHandler.php',
                params: {task: 'makeKMZ'},
                waitMsg:'Generating KML...',
                success: function(form, action) {

                    // Check if GE plugin
                    if (TME.google.earth) {
                        // Link to KMZ file
                        var kmzlink = TME.google.baseURL + action.result.file;

                        // Remove existing KML (if exists)
                        if (TME.google.networkLink) {
                            TME.google.earth.getGlobe().getFeatures().removeChild(TME.google.networkLink);
                            TME.google.networkLink = null;
                        }

                        // Show borders if bar or proportional symbol map
                        TME.google.earth.getLayerRoot().enableLayerById(TME.google.earth.LAYER_BORDERS, false);
                        if (TME.field.symbol.getValue() || TME.field.bar.getValue()) {
                            TME.google.earth.getLayerRoot().enableLayerById(TME.google.earth.LAYER_BORDERS, true);
                        }

                        // Load KML
                        TME.google.networkLink = TME.google.earth.createNetworkLink("");
                        TME.google.networkLink.setFlyToView(true);
                        var link = TME.google.earth.createLink("");
                        link.setHref(kmzlink);
                        TME.google.networkLink.setLink(link);

                        // Add KML to GE plugin and show window
                        TME.google.earth.getGlobe().getFeatures().appendChild(TME.google.networkLink);
                        TME.google.earth.getWindow().setVisibility(true);
                    }

                    TME.window.previw.show();

                },
                failure: function(form, action) {
                    Ext.MessageBox.alert('Error', 'Engine failed');
                }
            });
        }
    }),

    // Submit button
    submit: TME.engine.addButton({
        text: 'Download',
        disabled: true,
        handler: function(){
            TME.engine.form.submit({
                url:'TME_FormHandler.php',
                params: {task: 'makeKMZ'},
                waitMsg:'Generating KML...',
                success: function (form, action) {
                    Ext.Msg.buttonText.cancel = 'Close';
                    Ext.Msg.show({
                        title: 'Download',
                        msg: '<a href="' + action.result.file + '"><div style="text-decoration:underline;color:#000000">Click here to download the file to your computer</div></a>',
                        buttons: Ext.Msg.CANCEL,
                        icon: Ext.Msg.INFO,
                        minWidth: 350
                    });
                },
                failure: function(form, action) {
                    Ext.MessageBox.alert('Error', 'Engine failed');
                }
            });
        }
    })

}

TME.window = {
    previw: new Ext.Window({
        layout: 'fit',
        width: 660,
        height: 530,
        shadow: true,
        title: 'Preview KML',
        html: '<div id="map3d_container" style="height: 100%; width: 100%;"><div id="map3d" style="height: 100%; width: 100%"></div></div>',
        closeAction: 'hide',
        modal: true,
        draggable: false
    })
}


// Create application
// Anonymous function (function without name) that runs immediately after parsing
TME.app = function() {
    // Do NOT access DOM from here; elements don't exist yet

    // Private variables (not visible outside the application)
    var kmzURL; // URL to KMZ genereated by server


    // Public space
    return {
        // Public method (returned by the anonymous function)
        init: function() {

            Ext.QuickTips.init();

            // Turn on validation errors beside the field globally
            Ext.form.Field.prototype.msgTarget = 'side';

            // Need to show before GE instance can be created - better way?
            TME.window.previw.show();
            google.earth.createInstance( "map3d",
                                         function(object) {
                                            TME.google.earth = object;
                                         },
                                         function(object) {} );
            TME.window.previw.hide();

            var form = Ext.get('tme');
            TME.engine.render(form);

            // Default field status
            TME.fieldset.prismStyle.hide();
            TME.fieldset.symbolStyle.hide();
            TME.field.hideField(TME.field.colourScale);
            TME.field.hideField(TME.field.singleColour);
            TME.field.hideField(TME.field.colour);
            TME.field.hideField(TME.field.numClasses);
            TME.data.shapeStore.loadData( TME.data.images );
        }
    };


}(); // end of app

Ext.onReady(TME.app.init, TME.app);