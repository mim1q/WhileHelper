import { JAVASCRIPT_COLORS } from "./javascript_colors.js";
import { Colorer } from "./colorer.js";
import { CodeInspector } from "./code_inspector.js";

let code = document.getElementById('code_block');
    code.innerHTML 
        += 'var i, x;\n'
        + 'i = @i_init@;\n'
        + 'x = @x_init@;\n'
        + 'while(i <= @i_lte@) @while_condition@\n'
        + '{\n'
        + '    document.write(x + "&lt;br&gt;");\n'
        + '    x = x + @x_add@;\n'
        + '    i++;\n'
        + '}\n'
        + ' '

let color = new Colorer(code, JAVASCRIPT_COLORS);
color.color();

code.innerHTML = '<div class="slider" id="code_slider"></div>' + code.innerHTML;

let inspector = new CodeInspector(
    document.getElementById('code_slider'),
    code,
    document.getElementById('while_condition'),
    document.getElementById('history_i'),
    document.getElementById('history_x'),
    20,
    14
);

inspector.setupButtons(
    document.getElementById('reset_button'),
    document.getElementById('forward_button'),
    document.getElementById('edit_button'),
    document.getElementById('history_button')
)
