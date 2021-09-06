function getUuid(format = 'xxxx-xxxx-xxx') {
    let handler = function(length) {
        return Math.random().toString(36).substring(2, 2 + length)
    }
    return format.split('-').reduce((result, item)=> {
        result += '-' + handler(item.length);
        return result;
    }, '').substring(1)
}

//需要手动设置target父级元素为定位父级
function waterMarked({
    target = "#pic",
    text = '测试水印',
    gap = [24, 36],
    fontSize = 16,
    rotate = 45
}){
    let gapX, gapY, cvs, ctx, el;
    if(Array.isArray(gap)) {
        gapX = gap[0];
        gapY = gap[1];
    }else {
        gapX = gap || 0;
        gapY = gap || 0;
    }
    el = document.querySelector(target);
    if(!el || !el.offsetWidth) {
        console.warn('未检索到' + target +'元素')
        return setTimeout(function() {
            waterMarked({
                target,
                text,
                gap
            })
        },200)
    }
    cvs = document.querySelector(target + '-watermarked') || document.createElement('canvas');
    ctx = cvs.getContext('2d');
    cvs.id = target.substring(1) + '-watermarked';
    cvs.width = el.getBoundingClientRect().width;
    cvs.height = el.getBoundingClientRect().height;
    let positionY = el.offsetTop;
    let positionX = el.offsetLeft;
    cvs.style.cssText = `position: absolute;top;left: ${positionX}px;top: ${positionY}px`;
    ctx.rotate(rotate * Math.PI/180);
    ctx.fillStyle = 'rgba(0, 0, 0, .4)';
    ctx.font = `${fontSize}px`
    let cols = Math.ceil(cvs.width / ctx.measureText(text).width + gapX) + 16;
    let rows = Math.ceil(cvs.height / fontSize + gapY) + 16;
    console.log(cols, rows)
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            ctx.fillText(text, gapX * 1/2 + gapX * j + ctx.measureText(text).width * j, gapY * 1/2 + (i - 8) * gapY + (i - 8) * fontSize)
        }
    }
    !document.querySelector(`${target}-watermarked`) && el.parentNode.appendChild(cvs);
}
function getQueryParam(attr) {
    let obj = location.search.substring(1).split('&').reduce((target, item)=> {
        let key = item.split('=')[0];
        let value = item.split('=')[1];
        target[key] = value;
        return target;
    }, {})
    if(!attr) {
        return obj;
    }else {
        return obj[attr] || ''
    }
}