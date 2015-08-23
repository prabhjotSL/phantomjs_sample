/*********************************************************************
 * This is a fork from the CSS Style Declaration part of
 * https://github.com/NV/CSSOM
 ********************************************************************/
"use strict";
/*jslint es5: true*/
var CSSOM = require('cssom');
var fs = require('fs');
var path = require('path');

/**
 * @constructor
 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
 */
var CSSStyleDeclaration = function CSSStyleDeclaration() {
    this._values = {};
    this._importants = {};
    this._length = 0;
};
CSSStyleDeclaration.prototype = {
    constructor: CSSStyleDeclaration,

    /**
     *
     * @param {string} name
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
     * @return {string} the value of the property if it has been explicitly set for this declaration block.
     * Returns the empty string if the property has not been set.
     */
    getPropertyValue: function (name) {
        return this._values[name] || "";
    },

    /**
     *
     * @param {string} name
     * @param {string} value
     * @param {string} [priority=null] "important" or null
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
     */
    setProperty: function (name, value, priority) {
        if (value === undefined) {
            return;
        }
        if (value === null || value === '') {
            this.removeProperty(name);
            return;
        }
        if (this._values[name]) {
            // Property already exist. Overwrite it.
            var index = Array.prototype.indexOf.call(this, name);
            if (index < 0) {
                this[this._length] = name;
                this._length++;
            }
        } else {
            // New property.
            this[this._length] = name;
            this._length++;
        }
        this._values[name] = value;
        this._importants[name] = priority;
    },

    /**
     *
     * @param {string} name
     * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
     * @return {string} the value of the property if it has been explicitly set for this declaration block.
     * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
     */
    removeProperty: function (name) {
        if (!this._values.hasOwnProperty(name)) {
            return "";
        }
        var index = Array.prototype.indexOf.call(this, name);
        if (index < 0) {
            return "";
        }
        var prevValue = this._values[name];
        delete this._values[name];

        // That's what WebKit and Opera do
        Array.prototype.splice.call(this, index, 1);

        // That's what Firefox does
        //this[index] = ""

        return prevValue;
    },


    /**
     *
     * @param {String} name
     */
    getPropertyPriority: function (name) {
        return this._importants[name] || "";
    },


    getPropertyCSSValue: function () {
        //FIXME
    },

    /**
     *   element.style.overflow = "auto"
     *   element.style.getPropertyShorthand("overflow-x")
     *   -> "overflow"
     */
    getPropertyShorthand: function () {
        //FIXME
    },

    isPropertyImplicit: function () {
        //FIXME
    },

    /**
     *   http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-item
     */
    item: function (index) {
        index = parseInt(index, 10);
        if (index < 0 || index >= this._length) {
            return '';
        }
        return this[index];
    }
};

Object.defineProperties(CSSStyleDeclaration.prototype, {
    cssText: {
        get: function () {
            var properties = [];
            var i;
            for (i = 0; i < this._length; i++) {
                var name = this[i];
                var value = this.getPropertyValue(name);
                var priority = this.getPropertyPriority(name);
                if (priority !== '') {
                    priority = " !" + priority;
                }
                properties.push([name, ': ', value, priority, ';'].join(''));
            }
            return properties.join(' ');
        },
        set: function (value) {
            var i;
            this._values = {};
            Array.prototype.splice.call(this, 0, this._length);
            this._importants = {};
            var dummyRule = CSSOM.parse('#bogus{' + value + '}').cssRules[0].style;
            var rule_length = dummyRule.length;
            var name;
            for (i = 0; i < rule_length; ++i) {
                name = dummyRule[i];
                this.setProperty(dummyRule[i], dummyRule.getPropertyValue(name), dummyRule.getPropertyPriority(name));
            }
        },
        enumerable: true,
        configurable: true
    },
    parentRule: {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    },
    length: {
        get: function () { return this._length; },
        /**
         * This deletes indices if the new length is less then the current
         * length. If the new length is more, it does nothing, the new indices
         * will be undefined until set.
         **/
        set: function (value) {
            var i;
            for (i = value; i < this._length; i++) {
                delete this[i];
            }
            this._length = value;
        },
        enumerable: true,
        configurable: true
    }
});

/*
 *
 * http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSS2Properties
 */
Object.defineProperty(CSSStyleDeclaration.prototype, 'alignmentBaseline.js', require('./properties/alignmentBaseline.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'azimuth.js', require('./properties/azimuth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'background.js', require('./properties/background.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundAttachment.js', require('./properties/backgroundAttachment.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundClip.js', require('./properties/backgroundClip.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundColor.js', require('./properties/backgroundColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundImage.js', require('./properties/backgroundImage.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundOrigin.js', require('./properties/backgroundOrigin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundPosition.js', require('./properties/backgroundPosition.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundPositionX.js', require('./properties/backgroundPositionX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundPositionY.js', require('./properties/backgroundPositionY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundRepeat.js', require('./properties/backgroundRepeat.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundRepeatX.js', require('./properties/backgroundRepeatX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundRepeatY.js', require('./properties/backgroundRepeatY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundSize.js', require('./properties/backgroundSize.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'baselineShift.js', require('./properties/baselineShift.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'border.js', require('./properties/border.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderBottom.js', require('./properties/borderBottom.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderBottomColor.js', require('./properties/borderBottomColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderBottomLeftRadius.js', require('./properties/borderBottomLeftRadius.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderBottomRightRadius.js', require('./properties/borderBottomRightRadius.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderBottomStyle.js', require('./properties/borderBottomStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderBottomWidth.js', require('./properties/borderBottomWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderCollapse.js', require('./properties/borderCollapse.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderColor.js', require('./properties/borderColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderImage.js', require('./properties/borderImage.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderImageOutset.js', require('./properties/borderImageOutset.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderImageRepeat.js', require('./properties/borderImageRepeat.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderImageSlice.js', require('./properties/borderImageSlice.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderImageSource.js', require('./properties/borderImageSource.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderImageWidth.js', require('./properties/borderImageWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderLeft.js', require('./properties/borderLeft.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderLeftColor.js', require('./properties/borderLeftColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderLeftStyle.js', require('./properties/borderLeftStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderLeftWidth.js', require('./properties/borderLeftWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderRadius.js', require('./properties/borderRadius.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderRight.js', require('./properties/borderRight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderRightColor.js', require('./properties/borderRightColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderRightStyle.js', require('./properties/borderRightStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderRightWidth.js', require('./properties/borderRightWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderSpacing.js', require('./properties/borderSpacing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderStyle.js', require('./properties/borderStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderTop.js', require('./properties/borderTop.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderTopColor.js', require('./properties/borderTopColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderTopLeftRadius.js', require('./properties/borderTopLeftRadius.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderTopRightRadius.js', require('./properties/borderTopRightRadius.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderTopStyle.js', require('./properties/borderTopStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderTopWidth.js', require('./properties/borderTopWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'borderWidth.js', require('./properties/borderWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'bottom.js', require('./properties/bottom.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'boxShadow.js', require('./properties/boxShadow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'boxSizing.js', require('./properties/boxSizing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'captionSide.js', require('./properties/captionSide.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'clear.js', require('./properties/clear.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'clip.js', require('./properties/clip.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'color.js', require('./properties/color.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'colorInterpolation.js', require('./properties/colorInterpolation.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'colorInterpolationFilters.js', require('./properties/colorInterpolationFilters.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'colorProfile.js', require('./properties/colorProfile.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'colorRendering.js', require('./properties/colorRendering.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'content.js', require('./properties/content.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'counterIncrement.js', require('./properties/counterIncrement.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'counterReset.js', require('./properties/counterReset.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'cssFloat.js', require('./properties/cssFloat.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'cue.js', require('./properties/cue.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'cueAfter.js', require('./properties/cueAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'cueBefore.js', require('./properties/cueBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'cursor.js', require('./properties/cursor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'direction.js', require('./properties/direction.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'display.js', require('./properties/display.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'dominantBaseline.js', require('./properties/dominantBaseline.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'elevation.js', require('./properties/elevation.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'emptyCells.js', require('./properties/emptyCells.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'enableBackground.js', require('./properties/enableBackground.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fill.js', require('./properties/fill.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fillOpacity.js', require('./properties/fillOpacity.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fillRule.js', require('./properties/fillRule.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'filter.js', require('./properties/filter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'floodColor.js', require('./properties/floodColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'floodOpacity.js', require('./properties/floodOpacity.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'font.js', require('./properties/font.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontFamily.js', require('./properties/fontFamily.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontSize.js', require('./properties/fontSize.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontSizeAdjust.js', require('./properties/fontSizeAdjust.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontStretch.js', require('./properties/fontStretch.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontStyle.js', require('./properties/fontStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontVariant.js', require('./properties/fontVariant.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'fontWeight.js', require('./properties/fontWeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'glyphOrientationHorizontal.js', require('./properties/glyphOrientationHorizontal.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'glyphOrientationVertical.js', require('./properties/glyphOrientationVertical.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'height.js', require('./properties/height.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'imageRendering.js', require('./properties/imageRendering.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'kerning.js', require('./properties/kerning.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'left.js', require('./properties/left.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'letterSpacing.js', require('./properties/letterSpacing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'lightingColor.js', require('./properties/lightingColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'lineHeight.js', require('./properties/lineHeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'listStyle.js', require('./properties/listStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'listStyleImage.js', require('./properties/listStyleImage.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'listStylePosition.js', require('./properties/listStylePosition.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'listStyleType.js', require('./properties/listStyleType.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'margin.js', require('./properties/margin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'marginBottom.js', require('./properties/marginBottom.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'marginLeft.js', require('./properties/marginLeft.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'marginRight.js', require('./properties/marginRight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'marginTop.js', require('./properties/marginTop.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'marker.js', require('./properties/marker.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'markerEnd.js', require('./properties/markerEnd.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'markerMid.js', require('./properties/markerMid.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'markerOffset.js', require('./properties/markerOffset.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'markerStart.js', require('./properties/markerStart.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'marks.js', require('./properties/marks.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'mask.js', require('./properties/mask.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'maxHeight.js', require('./properties/maxHeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'maxWidth.js', require('./properties/maxWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'minHeight.js', require('./properties/minHeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'minWidth.js', require('./properties/minWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'opacity.js', require('./properties/opacity.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'orphans.js', require('./properties/orphans.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'outline.js', require('./properties/outline.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'outlineColor.js', require('./properties/outlineColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'outlineOffset.js', require('./properties/outlineOffset.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'outlineStyle.js', require('./properties/outlineStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'outlineWidth.js', require('./properties/outlineWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'overflow.js', require('./properties/overflow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'overflowX.js', require('./properties/overflowX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'overflowY.js', require('./properties/overflowY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'padding.js', require('./properties/padding.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'paddingBottom.js', require('./properties/paddingBottom.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'paddingLeft.js', require('./properties/paddingLeft.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'paddingRight.js', require('./properties/paddingRight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'paddingTop.js', require('./properties/paddingTop.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'page.js', require('./properties/page.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pageBreakAfter.js', require('./properties/pageBreakAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pageBreakBefore.js', require('./properties/pageBreakBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pageBreakInside.js', require('./properties/pageBreakInside.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pause.js', require('./properties/pause.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pauseAfter.js', require('./properties/pauseAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pauseBefore.js', require('./properties/pauseBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pitch.js', require('./properties/pitch.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pitchRange.js', require('./properties/pitchRange.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'playDuring.js', require('./properties/playDuring.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'pointerEvents.js', require('./properties/pointerEvents.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'position.js', require('./properties/position.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'quotes.js', require('./properties/quotes.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'resize.js', require('./properties/resize.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'richness.js', require('./properties/richness.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'right.js', require('./properties/right.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'shapeRendering.js', require('./properties/shapeRendering.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'size.js', require('./properties/size.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'speak.js', require('./properties/speak.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'speakHeader.js', require('./properties/speakHeader.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'speakNumeral.js', require('./properties/speakNumeral.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'speakPunctuation.js', require('./properties/speakPunctuation.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'speechRate.js', require('./properties/speechRate.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'src.js', require('./properties/src.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'stopColor.js', require('./properties/stopColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'stopOpacity.js', require('./properties/stopOpacity.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'stress.js', require('./properties/stress.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'stroke.js', require('./properties/stroke.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeDasharray.js', require('./properties/strokeDasharray.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeDashoffset.js', require('./properties/strokeDashoffset.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeLinecap.js', require('./properties/strokeLinecap.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeLinejoin.js', require('./properties/strokeLinejoin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeMiterlimit.js', require('./properties/strokeMiterlimit.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeOpacity.js', require('./properties/strokeOpacity.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'strokeWidth.js', require('./properties/strokeWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'tableLayout.js', require('./properties/tableLayout.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textAlign.js', require('./properties/textAlign.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textAnchor.js', require('./properties/textAnchor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textDecoration.js', require('./properties/textDecoration.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textIndent.js', require('./properties/textIndent.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textLineThrough.js', require('./properties/textLineThrough.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textLineThroughColor.js', require('./properties/textLineThroughColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textLineThroughMode.js', require('./properties/textLineThroughMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textLineThroughStyle.js', require('./properties/textLineThroughStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textLineThroughWidth.js', require('./properties/textLineThroughWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textOverflow.js', require('./properties/textOverflow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textOverline.js', require('./properties/textOverline.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textOverlineColor.js', require('./properties/textOverlineColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textOverlineMode.js', require('./properties/textOverlineMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textOverlineStyle.js', require('./properties/textOverlineStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textOverlineWidth.js', require('./properties/textOverlineWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textRendering.js', require('./properties/textRendering.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textShadow.js', require('./properties/textShadow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textTransform.js', require('./properties/textTransform.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textUnderline.js', require('./properties/textUnderline.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textUnderlineColor.js', require('./properties/textUnderlineColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textUnderlineMode.js', require('./properties/textUnderlineMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textUnderlineStyle.js', require('./properties/textUnderlineStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'textUnderlineWidth.js', require('./properties/textUnderlineWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'top.js', require('./properties/top.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'unicodeBidi.js', require('./properties/unicodeBidi.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'unicodeRange.js', require('./properties/unicodeRange.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'vectorEffect.js', require('./properties/vectorEffect.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'verticalAlign.js', require('./properties/verticalAlign.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'visibility.js', require('./properties/visibility.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'voiceFamily.js', require('./properties/voiceFamily.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'volume.js', require('./properties/volume.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimation.js', require('./properties/webkitAnimation.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationDelay.js', require('./properties/webkitAnimationDelay.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationDirection.js', require('./properties/webkitAnimationDirection.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationDuration.js', require('./properties/webkitAnimationDuration.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationFillMode.js', require('./properties/webkitAnimationFillMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationIterationCount.js', require('./properties/webkitAnimationIterationCount.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationName.js', require('./properties/webkitAnimationName.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationPlayState.js', require('./properties/webkitAnimationPlayState.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAnimationTimingFunction.js', require('./properties/webkitAnimationTimingFunction.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAppearance.js', require('./properties/webkitAppearance.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitAspectRatio.js', require('./properties/webkitAspectRatio.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBackfaceVisibility.js', require('./properties/webkitBackfaceVisibility.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBackgroundClip.js', require('./properties/webkitBackgroundClip.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBackgroundComposite.js', require('./properties/webkitBackgroundComposite.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBackgroundOrigin.js', require('./properties/webkitBackgroundOrigin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBackgroundSize.js', require('./properties/webkitBackgroundSize.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderAfter.js', require('./properties/webkitBorderAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderAfterColor.js', require('./properties/webkitBorderAfterColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderAfterStyle.js', require('./properties/webkitBorderAfterStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderAfterWidth.js', require('./properties/webkitBorderAfterWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderBefore.js', require('./properties/webkitBorderBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderBeforeColor.js', require('./properties/webkitBorderBeforeColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderBeforeStyle.js', require('./properties/webkitBorderBeforeStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderBeforeWidth.js', require('./properties/webkitBorderBeforeWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderEnd.js', require('./properties/webkitBorderEnd.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderEndColor.js', require('./properties/webkitBorderEndColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderEndStyle.js', require('./properties/webkitBorderEndStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderEndWidth.js', require('./properties/webkitBorderEndWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderFit.js', require('./properties/webkitBorderFit.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderHorizontalSpacing.js', require('./properties/webkitBorderHorizontalSpacing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderImage.js', require('./properties/webkitBorderImage.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderRadius.js', require('./properties/webkitBorderRadius.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderStart.js', require('./properties/webkitBorderStart.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderStartColor.js', require('./properties/webkitBorderStartColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderStartStyle.js', require('./properties/webkitBorderStartStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderStartWidth.js', require('./properties/webkitBorderStartWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBorderVerticalSpacing.js', require('./properties/webkitBorderVerticalSpacing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxAlign.js', require('./properties/webkitBoxAlign.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxDirection.js', require('./properties/webkitBoxDirection.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxFlex.js', require('./properties/webkitBoxFlex.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxFlexGroup.js', require('./properties/webkitBoxFlexGroup.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxLines.js', require('./properties/webkitBoxLines.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxOrdinalGroup.js', require('./properties/webkitBoxOrdinalGroup.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxOrient.js', require('./properties/webkitBoxOrient.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxPack.js', require('./properties/webkitBoxPack.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxReflect.js', require('./properties/webkitBoxReflect.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitBoxShadow.js', require('./properties/webkitBoxShadow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColorCorrection.js', require('./properties/webkitColorCorrection.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnAxis.js', require('./properties/webkitColumnAxis.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnBreakAfter.js', require('./properties/webkitColumnBreakAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnBreakBefore.js', require('./properties/webkitColumnBreakBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnBreakInside.js', require('./properties/webkitColumnBreakInside.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnCount.js', require('./properties/webkitColumnCount.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnGap.js', require('./properties/webkitColumnGap.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnRule.js', require('./properties/webkitColumnRule.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnRuleColor.js', require('./properties/webkitColumnRuleColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnRuleStyle.js', require('./properties/webkitColumnRuleStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnRuleWidth.js', require('./properties/webkitColumnRuleWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnSpan.js', require('./properties/webkitColumnSpan.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumnWidth.js', require('./properties/webkitColumnWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitColumns.js', require('./properties/webkitColumns.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFilter.js', require('./properties/webkitFilter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexAlign.js', require('./properties/webkitFlexAlign.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexDirection.js', require('./properties/webkitFlexDirection.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexFlow.js', require('./properties/webkitFlexFlow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexItemAlign.js', require('./properties/webkitFlexItemAlign.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexLinePack.js', require('./properties/webkitFlexLinePack.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexOrder.js', require('./properties/webkitFlexOrder.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexPack.js', require('./properties/webkitFlexPack.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlexWrap.js', require('./properties/webkitFlexWrap.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlowFrom.js', require('./properties/webkitFlowFrom.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFlowInto.js', require('./properties/webkitFlowInto.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFontFeatureSettings.js', require('./properties/webkitFontFeatureSettings.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFontKerning.js', require('./properties/webkitFontKerning.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFontSizeDelta.js', require('./properties/webkitFontSizeDelta.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFontSmoothing.js', require('./properties/webkitFontSmoothing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitFontVariantLigatures.js', require('./properties/webkitFontVariantLigatures.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitHighlight.js', require('./properties/webkitHighlight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitHyphenateCharacter.js', require('./properties/webkitHyphenateCharacter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitHyphenateLimitAfter.js', require('./properties/webkitHyphenateLimitAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitHyphenateLimitBefore.js', require('./properties/webkitHyphenateLimitBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitHyphenateLimitLines.js', require('./properties/webkitHyphenateLimitLines.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitHyphens.js', require('./properties/webkitHyphens.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLineAlign.js', require('./properties/webkitLineAlign.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLineBoxContain.js', require('./properties/webkitLineBoxContain.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLineBreak.js', require('./properties/webkitLineBreak.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLineClamp.js', require('./properties/webkitLineClamp.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLineGrid.js', require('./properties/webkitLineGrid.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLineSnap.js', require('./properties/webkitLineSnap.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLocale.js', require('./properties/webkitLocale.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLogicalHeight.js', require('./properties/webkitLogicalHeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitLogicalWidth.js', require('./properties/webkitLogicalWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginAfter.js', require('./properties/webkitMarginAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginAfterCollapse.js', require('./properties/webkitMarginAfterCollapse.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginBefore.js', require('./properties/webkitMarginBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginBeforeCollapse.js', require('./properties/webkitMarginBeforeCollapse.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginBottomCollapse.js', require('./properties/webkitMarginBottomCollapse.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginCollapse.js', require('./properties/webkitMarginCollapse.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginEnd.js', require('./properties/webkitMarginEnd.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginStart.js', require('./properties/webkitMarginStart.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarginTopCollapse.js', require('./properties/webkitMarginTopCollapse.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarquee.js', require('./properties/webkitMarquee.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarqueeDirection.js', require('./properties/webkitMarqueeDirection.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarqueeIncrement.js', require('./properties/webkitMarqueeIncrement.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarqueeRepetition.js', require('./properties/webkitMarqueeRepetition.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarqueeSpeed.js', require('./properties/webkitMarqueeSpeed.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMarqueeStyle.js', require('./properties/webkitMarqueeStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMask.js', require('./properties/webkitMask.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskAttachment.js', require('./properties/webkitMaskAttachment.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskBoxImage.js', require('./properties/webkitMaskBoxImage.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskBoxImageOutset.js', require('./properties/webkitMaskBoxImageOutset.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskBoxImageRepeat.js', require('./properties/webkitMaskBoxImageRepeat.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskBoxImageSlice.js', require('./properties/webkitMaskBoxImageSlice.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskBoxImageSource.js', require('./properties/webkitMaskBoxImageSource.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskBoxImageWidth.js', require('./properties/webkitMaskBoxImageWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskClip.js', require('./properties/webkitMaskClip.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskComposite.js', require('./properties/webkitMaskComposite.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskImage.js', require('./properties/webkitMaskImage.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskOrigin.js', require('./properties/webkitMaskOrigin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskPosition.js', require('./properties/webkitMaskPosition.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskPositionX.js', require('./properties/webkitMaskPositionX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskPositionY.js', require('./properties/webkitMaskPositionY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskRepeat.js', require('./properties/webkitMaskRepeat.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskRepeatX.js', require('./properties/webkitMaskRepeatX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskRepeatY.js', require('./properties/webkitMaskRepeatY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaskSize.js', require('./properties/webkitMaskSize.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMatchNearestMailBlockquoteColor.js', require('./properties/webkitMatchNearestMailBlockquoteColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaxLogicalHeight.js', require('./properties/webkitMaxLogicalHeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMaxLogicalWidth.js', require('./properties/webkitMaxLogicalWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMinLogicalHeight.js', require('./properties/webkitMinLogicalHeight.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitMinLogicalWidth.js', require('./properties/webkitMinLogicalWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitNbspMode.js', require('./properties/webkitNbspMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitOverflowScrolling.js', require('./properties/webkitOverflowScrolling.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPaddingAfter.js', require('./properties/webkitPaddingAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPaddingBefore.js', require('./properties/webkitPaddingBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPaddingEnd.js', require('./properties/webkitPaddingEnd.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPaddingStart.js', require('./properties/webkitPaddingStart.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPerspective.js', require('./properties/webkitPerspective.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPerspectiveOrigin.js', require('./properties/webkitPerspectiveOrigin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPerspectiveOriginX.js', require('./properties/webkitPerspectiveOriginX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPerspectiveOriginY.js', require('./properties/webkitPerspectiveOriginY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitPrintColorAdjust.js', require('./properties/webkitPrintColorAdjust.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitRegionBreakAfter.js', require('./properties/webkitRegionBreakAfter.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitRegionBreakBefore.js', require('./properties/webkitRegionBreakBefore.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitRegionBreakInside.js', require('./properties/webkitRegionBreakInside.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitRegionOverflow.js', require('./properties/webkitRegionOverflow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitRtlOrdering.js', require('./properties/webkitRtlOrdering.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitSvgShadow.js', require('./properties/webkitSvgShadow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTapHighlightColor.js', require('./properties/webkitTapHighlightColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextCombine.js', require('./properties/webkitTextCombine.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextDecorationsInEffect.js', require('./properties/webkitTextDecorationsInEffect.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextEmphasis.js', require('./properties/webkitTextEmphasis.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextEmphasisColor.js', require('./properties/webkitTextEmphasisColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextEmphasisPosition.js', require('./properties/webkitTextEmphasisPosition.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextEmphasisStyle.js', require('./properties/webkitTextEmphasisStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextFillColor.js', require('./properties/webkitTextFillColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextOrientation.js', require('./properties/webkitTextOrientation.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextSecurity.js', require('./properties/webkitTextSecurity.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextSizeAdjust.js', require('./properties/webkitTextSizeAdjust.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextStroke.js', require('./properties/webkitTextStroke.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextStrokeColor.js', require('./properties/webkitTextStrokeColor.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTextStrokeWidth.js', require('./properties/webkitTextStrokeWidth.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransform.js', require('./properties/webkitTransform.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransformOrigin.js', require('./properties/webkitTransformOrigin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransformOriginX.js', require('./properties/webkitTransformOriginX.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransformOriginY.js', require('./properties/webkitTransformOriginY.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransformOriginZ.js', require('./properties/webkitTransformOriginZ.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransformStyle.js', require('./properties/webkitTransformStyle.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransition.js', require('./properties/webkitTransition.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransitionDelay.js', require('./properties/webkitTransitionDelay.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransitionDuration.js', require('./properties/webkitTransitionDuration.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransitionProperty.js', require('./properties/webkitTransitionProperty.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitTransitionTimingFunction.js', require('./properties/webkitTransitionTimingFunction.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitUserDrag.js', require('./properties/webkitUserDrag.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitUserModify.js', require('./properties/webkitUserModify.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitUserSelect.js', require('./properties/webkitUserSelect.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrap.js', require('./properties/webkitWrap.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrapFlow.js', require('./properties/webkitWrapFlow.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrapMargin.js', require('./properties/webkitWrapMargin.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrapPadding.js', require('./properties/webkitWrapPadding.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrapShapeInside.js', require('./properties/webkitWrapShapeInside.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrapShapeOutside.js', require('./properties/webkitWrapShapeOutside.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWrapThrough.js', require('./properties/webkitWrapThrough.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'webkitWritingMode.js', require('./properties/webkitWritingMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'whiteSpace.js', require('./properties/whiteSpace.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'widows.js', require('./properties/widows.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'width.js', require('./properties/width.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'wordBreak.js', require('./properties/wordBreak.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'wordSpacing.js', require('./properties/wordSpacing.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'wordWrap.js', require('./properties/wordWrap.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'writingMode.js', require('./properties/writingMode.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'zIndex.js', require('./properties/zIndex.js').definition);
Object.defineProperty(CSSStyleDeclaration.prototype, 'zoom.js', require('./properties/zoom.js').definition);

exports.CSSStyleDeclaration = CSSStyleDeclaration;
