/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const MapMyLocation = function(latlng, acc = null, map = null) {
  if (!(this instanceof MapMyLocation)) {
    return new MapMyLocation(latlng, acc, map)
  }
  this._map = null
  this._acc = null
  this._timer = null

  this._$icon = $('<div />')
  this._marker = L.marker(latlng, { icon: L.divIcon({
    className: 'marker-my-location',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: this._$icon.get(0),
    zIndexOffset: 999
  }) })

  this.acc(acc).map(map)
}
MapMyLocation.prototype.map = function(map) {
  if (map) {
    if (this._map !== map) {
      this._map = map
      this._marker.addTo(map)
    }
  } else if (this._map) {
    this._map.removeLayer(this._marker)
    this._map = null
  } else {
    this._map = null
  }
  return this.acc()
}
MapMyLocation.prototype.latlng = function(latlng) {
  if (this._marker) {
    this._marker.setLatLng(latlng)
  }
  return this
}
MapMyLocation.prototype.acc = function(val = undefined) {
  if (val === null || (typeof val == 'number' && !isNaN(val) && val !== Infinity)) {
    this._acc = val
  }

  clearTimeout(this._timer)
  this._timer = setTimeout(_ => {
    if (this._acc === null) {
      return this._$icon.removeAttr('style')
    }

    if (!this._map) {
      return this._$icon.removeAttr('style')
    }

    const mapHeightInMetres = this._map.getBounds().getSouthEast().distanceTo(this._map.getBounds().getNorthEast()) // 高度多少公尺
    const mapHeightInPixels = this._map.getSize().y // 高度多少 px
    this._$icon.attr('style', `--width: ${this._acc * (mapHeightInPixels / mapHeightInMetres)}px;`)
  }, 100)
  return this
}