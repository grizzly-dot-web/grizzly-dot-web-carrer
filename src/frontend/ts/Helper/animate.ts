export default function animateCss(element : HTMLElement) {
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
        let afterAnimation = () => {
            element.classList.remove('animated');
            element.removeEventListener(eventName, afterAnimation);

            return resolve();
        }
        
        element.addEventListener(eventName, afterAnimation);
    });
}