export function radiusToDegree(rad : number) {
    return (rad > 0 ? rad : (2*Math.PI + rad)) * 360 / (2*Math.PI)
}

export function	calcAngle(expierience : { x : number, y : number }, center : { x : number, y : number }){      
    var angle = Math.atan2(center.y - expierience.y, center.x - expierience.x);
    return radiusToDegree(angle);
}