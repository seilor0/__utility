
// ---------------------------
//            calc
// ---------------------------

export function xor(a,b) {
  if ( a&&!b || (!a)&&b ) return true;
  return false;
}

export function xnor(a,b) {
  if ( a&&b || (!a)&&(!b) ) return true;
  return false;
}

/**
 * 小数点第n位で四捨五入する関数
 * @param {number} num 元の数値
 * @param {int} digit 四捨五入する桁数
 * @returns 
 */
export function floatRound(num, digit) {
  const levarage = Math.pow(10,digit);
  return Math.round(num*levarage)/levarage;
}

export function rgb2hex (rgb) {
  if (!rgb)  return undefined;
  return '#' + rgb.match(/\d+/g).map(x => Number(x).toString(16).padStart(2,'0')).join('');
}

// ---------------------------
//    create html element
// ---------------------------

export function addElement (parent, tag, classList=[], innerHtml=null, attributes=[]) {
  const element = document.createElement(tag);
  if (classList.length) element.classList.add(...classList);
  if (innerHtml) element.innerHTML = innerHtml;
  if (attributes) attributes.forEach(attribute => element.setAttribute(attribute[0], attribute[1]));
  if (parent) parent.appendChild(element);
  return element;
};

/**
 * 
 * @param {HTMLElement} parent 
 * @param {Boolean} checked 
 * @param {String} text テキスト or {checked, notChecked}
 * @param {Boolean} sliderIsTop 
 * @returns {HTMLLabelElement} スライダーエレメント
 */
export function createToggleButton(parent, checked=false, text=null, sliderIsTop=true) {
  const label = document.createElement('label');
  label.className = 'toggle-button';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;

  const slider = document.createElement('span');
  slider.className = 'slider';

  label.appendChild(input);
  if (!text) {
    label.appendChild(slider);

  } else if (typeof(text)=='string') {
    label.appendChild(slider);
    label.insertAdjacentText(sliderIsTop ? 'beforeend' : 'afterbegin', text);

  } else if (typeof(text)=='object') {
    const checkedSpan = document.createElement('span');
    checkedSpan.className = 'checked';
    checkedSpan.innerText = text.checked ?? null;
    
    const notCheckedSpan = document.createElement('span');
    notCheckedSpan.className = 'not-checked';
    notCheckedSpan.innerText = text.notChecked ?? null;

    label.appendChild(checkedSpan);
    label.appendChild(notCheckedSpan);
    label.insertAdjacentElement(sliderIsTop ? 'afterbegin' : 'beforeend', slider);
  }
  
  parent.appendChild(label);
  return label;
}


/**
 * マルチセレクトエレメントをparentエレメントに追加する関数
 * @param {HTMLElement} parent 
 * @param {any has 'forEach' method} options
 * @returns {HTMLDivElement}
 */
export function createMultiSelect(id, parent, options=undefined) {
  const wrapper = document.createElement('div');
  const select  = document.createElement('button');
  const icon    = document.createElement('div');
  const multiPicker = document.createElement('div');
  
  wrapper.className = 'multi-select';
  wrapper.style.setProperty('--anchor-name', '--'+id);
  select.setAttribute('popovertarget', id);
  icon.className = 'arrow';

  multiPicker.id = id;
  multiPicker.className = 'multi-picker';
  multiPicker.popover = 'hint';

  select.appendChild(document.createElement('span'));
  select.appendChild(icon);
  
  wrapper.appendChild(select);
  wrapper.appendChild(multiPicker);

  setOptions2MultiSelect(wrapper,options);
  parent.appendChild(wrapper);

  multiPicker.addEventListener('click', e => {
    const selectedOptions = Array.from(e.currentTarget.querySelectorAll('input:checked'), input=>input.value).join(', ');
    e.currentTarget.parentElement.querySelector(':first-child > span').innerText = selectedOptions;
  });
  return wrapper;
}

/**
 * マルチセレクトエレメントに選択肢をセットする関数
 * @param {HTMLDivElement} multiSelect 
 * @param {any has 'forEach' method} options 
 */
export function setOptions2MultiSelect (multiSelect, options) {
  if(!options) return;
  const multiPicker = multiSelect.querySelector('.multi-picker');
  multiPicker.innerHTML = '';
  options.forEach(option => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = option;
    
    label.appendChild(input);
    label.insertAdjacentText('beforeend', option);
    multiPicker.appendChild(label);
  });
  return;
}

/**
 * 指定のテーブルに行を追加する関数
 * @param {HTMLTableSectionElement} parent 行を追加するエレメント(theader / tbody)
 * @param {Array || Int} content 追加する内容(forEach持ち) or 列数
 * @param {Number} thCol ヘッダーにする列の列数 デフォルトは-1(ヘッダーセルを作らない)
 * @param {Boolean} editable デフォルトfalse
 * @returns {HTMLTableRowElement} 追加した行エレメント
 */
export function addRow(parent, content, thCol=-1, editable=false) {
  if (!parent || !content) return;
  if (Number.isInteger(content))  content = Array(content).fill(null);

  const row = document.createElement('tr');

  content.forEach((value,i) => {
    const cell = document.createElement(i==thCol ? 'th' : 'td');
    cell.innerHTML = value ?? null;
    if (editable)  cell.contentEditable = 'plaintext-only';
    row.appendChild(cell);
  });

  parent.appendChild(row);
  return row;
}

// ---------------------------
//       Event Listener
// ---------------------------
export function clickNextInput (e) {
  if(e.currentTarget.nextElementSibling?.tagName=='INPUT') e.currentTarget.nextElementSibling.click();
}


// ---------------------------
//        get Element
// ---------------------------
export function batchMove(el, dirStr) {
  const func = (html, direction) => {
    if (!html) return null;
    switch (direction) {
      case '↑':
        return html.parentElement;
      case '←':
        return html.previousElementSibling;
      case '→':
        return html.nextElementSibling;
      case '↓':
        return html.firstElementChild;
      default:
        return null;
    }
  };
  dirStr.split('').forEach(direction => el = func(el, direction));
  return el;
}