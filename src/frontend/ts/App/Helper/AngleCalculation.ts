export function radiusToDegree(rad : number) {
    return (rad > 0 ? rad : (2*Math.PI + rad)) * 360 / (2*Math.PI)
}

export function	calcAngle(expierience : { top : number, left : number }, center : { top : number, left : number }){      
    var angle = Math.atan2(center.top - expierience.top, center.left - expierience.left);
    return radiusToDegree(angle);
}