export default function getSelectValues(select) {
    let result = [];
    let options = select && select.options;
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value);
      }
    }
    return result;
  }