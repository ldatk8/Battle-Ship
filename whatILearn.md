# New infomation
### Js
- Always use only cameCase for stake_case for naming 
- Stick all relavant UI to object so we can easy use it, It is store by reference so don't cost much memory
- Always repect MVC modal, don't call controler inside View (screenControler file)
- We can make a custom event to resolve above problem
- Use throw Error instead of return string statement and try catch to log err
- To delete some propertie of object we can use `delete obj[name]`
``` javascript
// Bên trong hàm drawBoard
function drawBoard(b) {
    // ... (code tạo thẻ div cell của bạn) ...
    
    b.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cell')) return;
        
        // TẠO VÀ PHÁT SỰ KIỆN CUSTOM
        const fireEvent = new CustomEvent('playerFired', {
            detail: { cellClicked: e.target } // Đóng gói dữ liệu ô bị click mang đi
        });
        document.dispatchEvent(fireEvent); // Phát sóng sự kiện ra toàn document
    });
}
```
### CSS
- Want to make a close button in the top right of element, we need to use
    postion: absolute for children and postion: relative for parent
- Make height equal width use `aspect-ratio: 1 / 1`
- Want to disable click we can use `pointer-events: none`
- Make work break line when too long: `overflow-wrap: break-work`
- If want to use \n or long whitespace, need to use `white-space: pre-wrap`
- Want to make a popup, we make a div wrap content (say overlay then apply such css style) 
``` css
.overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgb(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex; justify-content: center; align-items: center;
    display: none;
    // Note that we may add listener to window object when user click outside popup they can easy to close it 
}
```

### HTML
- When we not use webpack, and want to use multiple js file we need to add type="module" inside script tab, and it only run when we use server like live server
