export default function animateCss(element : HTMLElement, reverse : boolean = false) {
    return new Promise((resolve) => {
        var eventName = (function(el) {
            var animations = {
              animation: 'animationend',
              OAnimation: 'oAnimationEnd',
              MozAnimation: 'mozAnimationEnd',
              WebkitAnimation: 'webkitAnimationEnd',
            };
      
            for (var t in animations) {
              if (el.style[t] !== undefined) {
                return animations[t];
              }
            }
          })(document.createElement('div'));
          
        element.classList.add('animated');
        if (reverse) {
            element.classList.add('reversed');
        }

        let afterAnimation = () => {
            element.classList.remove('animated');
            element.classList.remove('reversed');
            element.removeEventListener(eventName, afterAnimation);

            return resolve();
        }
        
        element.addEventListener(eventName, afterAnimation);
    });
}