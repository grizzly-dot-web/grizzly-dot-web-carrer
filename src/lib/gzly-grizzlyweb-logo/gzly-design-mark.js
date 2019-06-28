export default class GzlyDesignMark {
/**
 * @type {SVGElement}
 */
svg;

/**
 * @type {NodeListOf<SVGPolygonElement>}
 */
polygons;

constructor (svg) {
  this.svg = svg
  this.polygons = this.svg.querySelectorAll('polygon')
  this._animationRestartListener = this._animationRestartListener.bind(this)
}

_animationRestartListener () {
  return new Promise((resolve, reject) => {
    this.svg.classList.remove('gzly_logo__polygon--startedAnimation')
    setTimeout(() => {
      this.svg.classList.add('gzly_logo__polygon--startedAnimation')
      this.svg.classList.toggle('gzly_logo__polygon--animationReverse')

      return resolve()
    }, 50)
  })
}

startLoading () {
  this.svg.classList.add('gzly_logo__polygon--isLoading')
  this.svg.classList.add('gzly_logo__polygon--startedAnimation')
  this.polygons[0].addEventListener('animationend', this._animationRestartListener)
}

stopLoading () {
  this.svg.classList.remove('gzly_logo__polygon--startedAnimation')
  this.svg.classList.remove('gzly_logo__polygon--isLoading')
  this.polygons[0].removeEventListener('animationend', this._animationRestartListener)
}
}
