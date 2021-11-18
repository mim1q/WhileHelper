export class CodeInspector {
    constructor(slider, codeblock, condition, i, x, offset, initial_offset) {
        this.slider = slider;
        this.codeblock = codeblock;
        this.history_i = i;
        this.history_x = x;
        this.offset = offset;
        this.initial_offset = initial_offset;
        this.condition = condition;

        this.states = [];
        this.current_state = 0;

        this.editing = false;
        this.history_shown = false;

        this.generateStates();
        this.updateState();
    }

    generateStates() {
        this.states = [];

        const i_init = parseInt(document.getElementById('i_init').innerText);
        const x_init = parseInt(document.getElementById('x_init').innerText);
        const i_lte = parseInt(document.getElementById('i_lte').innerText);
        const x_add = parseInt(document.getElementById('x_add').innerText);

        this.addState(0, '?', '?', '', null);
        this.addState(1, i_init, '?', '', null);
        this.addState(2, i_init, x_init, '', null);
        
        let i = this.states[this.states.length - 1]['i'];
        let x = this.states[this.states.length - 1]['x'];
        let text = '';

        this.addState(3, i_init, x_init, '', i <= i_lte);

        while(i <= i_lte) {
            text += x + '</br>';
            this.addState(5, i, x, text, true);
            x = x + x_add;
            this.addState(6, i, x, text, true);
            i++;
            this.addState(7, i, x, text, true);
            const cond = i <= i_lte;
            this.addState(3, i, x, text, cond);
        }

        this.addState(9, i, x, text, false);
    }

    addState(slider_position, i, x, text, condition) {
        const state = {
            'slider_position': slider_position,
            'i': i,
            'x': x,
            'text': text,
            'condition': condition 
        };
        this.states.push(state);
    }

    setupButtons(back_button, fwd_button, edit_button, history_button) {
        back_button.onclick = () => this.hardReset();
        fwd_button.onclick = () => this.moveForward();
        this.edit_button = edit_button;
        this.edit_button.onclick = () => this.toggleEditing();
        this.history_button = history_button;
        this.history_button.onclick = () => this.toggleHistory();
    }

    updateState() {
        const state = this.states[this.current_state];
        this.slider.style.top = this.initial_offset + this.offset * state['slider_position'] + 'px';

        const doc = document.getElementById('document_content');
        doc.innerHTML = state['text'];
        
        this.history_i.innerHTML += `<div class="variable-value">${state['i']}</div>`;
        this.history_x.innerHTML += `<div class="variable-value">${state['x']}</div>`;
        const cond = state['condition'];
            this.condition.innerText = cond !== null 
                ? (cond ? '// prawda' : '// fałsz') 
                : '';
    }

    reset() {
        this.current_state = 0; 
        this.history_i.innerHTML = '';
        this.history_x.innerHTML = '';
        if(this.editing == true) {
            this.toggleEditing();
        }
        this.updateState();
        this.generateStates();
    }

    hardReset() {
        document.getElementById('i_init').innerText = 1;
        document.getElementById('x_init').innerText = 2;
        document.getElementById('i_lte').innerText = 4;
        document.getElementById('x_add').innerText = 2;
        this.reset();
    }

    moveForward() {
        if(this.current_state < this.states.length - 1 && !this.editing) {
            this.current_state++;
            this.updateState();
        }
    }

    toggleEditing() {
        
        this.editing = !this.editing;
        const inputs = document.getElementsByClassName('input');
        
        if(this.editing) {
            this.edit_button.innerHTML = '&check;';
            for (let n of inputs) {
                n.setAttribute('contenteditable', 'true');
            }
        } 
        else {
            this.edit_button.innerHTML = '&#x270E;';
            for (let n of inputs) {
                n.removeAttribute('contenteditable');
            }
            this.reset();
        }
    }

    toggleHistory() {
        this.history_shown = !this.history_shown;
        const memory = document.getElementById('memory');

        if(this.history_shown) {
            this.history_button.innerHTML = 'X';
            memory.classList.add('full');
        }
        else {
            this.history_button.innerHTML = '&check;';
            memory.classList.remove('full');
        }
    }
}