export class Colorer {
    constructor(element, colorset) {
        this.element = element;
        this.colorset = colorset;
    }

    color() {
        const text = this.element.innerText;

        // Rozdziel tekst na poszczególne części
        const individualTokens = text.split(/( |,? |[;\.\,\(\)\{\}]|\||\+\+|\-\-)/g).filter((s) => s !== '');

        let outputText = '';
        let newLine = true;
        let lineNum = 1;

        for(let token of individualTokens) {

            if(token.match(/@.*@/)) {
                let temp;
                let value;
                switch(token) {
                    case '@i_init@':
                        value = 1; break;
                    case '@x_init@':
                        value = 2; break;
                    case '@i_lte@':
                        value = 4; break;
                    case '@x_add@':
                        value = 2; break;
                }

                if(token == '@while_condition@') {
                    temp = `<span id="while_condition"></span>`;
                } else {
                    temp = `<span class="input" id="${token.replace(/@/g, '')}" style="color: ${this.colorset['colors']['orange']};">${value}</span>`;
                }

                outputText += temp;
            } else {

                if(newLine) {
                    outputText += `<div class="code-line"><span class="code-line--number">${lineNum++}</span>`;
                    newLine = false;
                }
                if(token.match(/\".*\"/)) {
                    token = token.replace('<', '&lt;').replace('>', '&gt;');
                }
                const color = this.assignColor(token);
                if(token === "|") {
                    outputText += '</div>';
                    newLine = true;
                }
                else if(color === 'default') {
                    outputText += token;
                }
                else {
                    outputText += `<span style="color: ${color};">${token}</span>`
                }

            }
        }

        this.element.innerHTML = outputText;
    }

    assignColor(token) {

        if(token.match(/\d\d*/)) {
            return this.colorset['colors']['orange']
        }

        if(token.match(/\".*\"/)) {
            return this.colorset['colors']['green'];
        }

        if(!token.match(/\s/)) {
            let color = this.colorset['tokens'][token];
            if(color !== undefined) {
                return this.colorset['colors'][color];
            }
        }

        return 'default';
    }
}
