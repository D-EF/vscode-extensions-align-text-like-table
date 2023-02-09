
/**
 * @typedef Config__Text_Ctrl
 * @property {RegExp} [selector__render_half__full_width_characters]  使用正则表达式标记你当前字体中被当作半角(半型)字符进行渲染但是插件却认为那是全角字符的字符
 * @property {RegExp} [selector__render_full__half_width_characters]  使用正则表达式标记你当前字体中被当作全角(全型)字符进行渲染但是插件却认为那是半角字符的字符
 * @property {RegExp} [selector__separator]                           使用正则表达式标记分隔符
 * @property {string} [separator__align_after]                        对齐后追加的分隔符
 * @property {string} [justification]                                 对齐格式
 */

/** @type {Config__Text_Ctrl} */
var config__text_ctrl={
    selector__render_half__full_width_characters:/[]/,
    selector__render_full__half_width_characters:/[]/,
    selector__separator:/(?: {5,})|(?:\t\t+)/,
    separator__align_after:"     ",
    justification:"left",
}

/**
 * @param {Config__Text_Ctrl} config_value 
 */
function set_Config__config__text_ctrl(config_value){
    config_value.selector__render_half__full_width_characters&&(config__text_ctrl.selector__render_half__full_width_characters=transform_type([config_value.selector__render_half__full_width_characters,'g'],RegExp));
    config_value.selector__render_full__half_width_characters&&(config__text_ctrl.selector__render_full__half_width_characters=transform_type([config_value.selector__render_full__half_width_characters,'g'],RegExp));
    config_value.selector__separator&&(config__text_ctrl.selector__separator=transform_type([config_value.selector__separator,'g'],RegExp));
    config__text_ctrl.separator__align_after=config_value.separator__align_after||config__text_ctrl.separator__align_after;
    config__text_ctrl.justification=config_value.justification||config__text_ctrl.justification;
}

/**
 * @param {*[]} value       对象或构造函数的参数
 * @param {function()} type 类型的构造函数
 */
function transform_type(value,type){
    if(value[0].constructor===type||value[0] instanceof type){
        return value[0]
    }else{
        return new type(...value);
    }
}

/** 输出空格
 * @param {number} length 
 * @returns {string}
 */
function white_Space(length){
    if(isNaN(length))return '';
    if(length<0)return '';
    return new Array(length+1).join(' ');
}

/** 寻找第一个非空格字符
 * @param {string} str 
 * @returns {number}
 */
function index_FirstNotSpace(str){
    var i;
    for(i=0;i<str.length;++i){
        if(!(str[i]===' ')){
            return i;
        }
    }
    return i;
}

/** 检查第一个非空格字符位置是否正确
 * @param {string} str   字符串
 * @param {number} index 应该的位置
 * @return {boolean}
 */
function check_BeforeNotSpace(str,index){
    var i;
    for(i=0;i<index;++i){
        if(!(str[i]===' ')){
            return false;
        }
    }
    return true;
}

/** 填充空格以对齐
 * @param {string[][]}     list_line    已经被分隔符分开的二维数组数据
 * @param {[searchValue:string|RegExp,replaceValue:string][]} [_mapping_str] 
 * @returns {string[][]}
 */
function fill_LineList(list_line=false,_mapping_str){
    var i,j,k,l;
    var rtn=new Array(list_line.length);
    var list_line_rtn=new Array(list_line.length);
    var list_line_length=new Array(list_line.length);
    var target_length=[];
    var temp_str;

    for(i=list_line.length-1;i>=0;--i){
        list_line_rtn[i]=Array.from(list_line[i]);
        list_line_length[i]=new Array(list_line.length)
        for(j=0;j<list_line[i].length;++j){
            if(target_length.length<=j){
                target_length.length=list_line[i].length;
            }
            if(_mapping_str)for(k=_mapping_str.length-1;k>=0;--k){
                list_line_rtn[i][j]=list_line_rtn[i][j].replace(_mapping_str[k][0],_mapping_str[k][1]);
            }
            l=calc_RenderWidth(list_line_rtn[i][j]);
            list_line_length[i][j]=l;
            if(l>(target_length[j]||0)){
                target_length[j]=l;
            }
        }
    }

    // console.log(list_line_rtn,list_line_length);
    
    for(i=rtn.length-1;i>=0;--i){
        rtn[i]=new Array(list_line[i].length);

        j=list_line[i].length-1;
        rtn[i][j]=list_line_rtn[i][j];

        for(--j;j>=0;--j){
            if(config__text_ctrl.justification==="right"){
                temp_str=white_Space(target_length[j]-list_line_length[i][j])+list_line_rtn[i][j];
            }else{
                temp_str=list_line_rtn[i][j]+white_Space(target_length[j]-list_line_length[i][j]);
            }
            rtn[i][j]=temp_str;
        }
    }

    return rtn;
}


/** 计算字符串渲染宽度
 * @param {string} str 
 * @return {number}
 */
function calc_RenderWidth(str){
    var cj=str.match(/[\u2E81-\uffff]/g),
        fw=str.match(config__text_ctrl.selector__render_full__half_width_characters),
        hw=str.match(config__text_ctrl.selector__render_half__full_width_characters);
    // console.log('\n',str,cj,fw,hw);
    return str.length+
        (cj?cj.length:0)+
        (fw?fw.length:0)-
        (hw?hw.length:0);
}

/** 
 * @param {string} str 
 * @param {[RegExp|string,string][]} _mapping_str 
 * @returns 
 */
function align_Text(str,_mapping_str){
    var org_lines=str.split('\r\n')
    var transform_lines=[];
    var indent=index_FirstNotSpace(org_lines[0]),indent_line=0;
    var indent_space=white_Space(indent);
    
    for(var i=0;i<org_lines.length;++i){
        indent_line=index_FirstNotSpace(org_lines[i])
        if(indent_line<indent){
            org_lines[i]=white_Space(indent-indent_line)+org_lines[i];
        }else if(indent_line>indent){
            org_lines[i]=org_lines[i].slice(indent_line-indent);
        }
        transform_lines.push(org_lines[i].slice(index_FirstNotSpace(org_lines[i])).split(config__text_ctrl.selector__separator));
    }
    
    // console.log(indent)
    // console.log(transform_lines);

    return fill_LineList(transform_lines,
        _mapping_str
    ).map(item=>indent_space+item.join(config__text_ctrl.separator__align_after)).join('\r\n');
}



module.exports={
    white_Space,
    index_FirstNotSpace,
    fill_LineList,
    config__text_ctrl,
    set_Config__config__text_ctrl,
    align_Text
}