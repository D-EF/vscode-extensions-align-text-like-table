/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-02-04 19:49:51
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-02-09 12:49:51
 * @FilePath: \align-text-like-table\js\create_vsc_act.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */

const { align_Text, index_FirstNotSpace, set_Config__config__text_ctrl } = require('./lib/text_ctrl');
const vscode = require('vscode');
/**
 * @type {vscode.TextEditor}
 */
var editor;

function check_Editor(){
	if(!editor){
		throw new Error("Can not find the editor!");
	}
}

function find_Block(){
	var rtn=[];
	var i,j,k,l;
	var indent;
	var str_range;
	var temp_str;
	
	for(i=0;i<editor.selections.length;++i){
		if((editor.selections[i].start.line===editor.selections[i].end.line)&&(editor.selections[i].start.character===editor.selections[i].end.character)){
			j=editor.selections[i].start.line;
			k=editor.selections[i].start.line;
			indent=index_FirstNotSpace(editor.document.lineAt(j).text);
			// 向前查找同缩进的行
			while(j>=0){
				temp_str=editor.document.lineAt(j).text;
				l=index_FirstNotSpace(temp_str);
				if(
					(!(l===indent))||
					temp_str.length==l
				){
					++j;
					break;
				}
				--j;
			}

			// 向后查找同缩进的行
			while(k<editor.document.lineCount){
				temp_str=editor.document.lineAt(k).text;
				l=index_FirstNotSpace(temp_str);
				if(
					(!(l===indent))||
					temp_str.length==l
				){
					--k;
					break;
				}
				++k;
			}
			
			j=j<0?0:j;
			k=k>=editor.document.lineCount?editor.document.lineCount-1:k;
			temp_str=editor.document.lineAt(k).text;
			
			str_range=new vscode.Range(new vscode.Position(j,0),new vscode.Position(k,temp_str.length));
		}else{
			str_range=new vscode.Range(new vscode.Position(editor.selections[i].start.line,0),new vscode.Position(editor.selections[i].end.line+1,0));
			// editor.selections[i].end.character
		}
		rtn.push(str_range);
	}
	return rtn;
}

function create_AlignFnc(_mapping_str){
	return () => {
		var q=vscode.workspace.getConfiguration("align-text-like-table");
		
		// console.log(q.get("selector__separator"));
		set_Config__config__text_ctrl({
			selector__render_half__full_width_characters:q.get("selector__render_half__full_width_characters"),
			selector__render_full__half_width_characters:q.get("selector__render_full__half_width_characters"),
			selector__separator:q.get("selector__separator"),
			separator__align_after:q.get("separator__align_after"),
			justification:q.get("justification"),
		})
		
		editor=vscode.window.activeTextEditor||editor;
		check_Editor();
		editor?.edit(editBuilder=>{
			
			var i;
			var str_range=find_Block();
			var orgstr, str;

			for(i=str_range.length-1;i>=0;--i){
				orgstr=editor.document.getText(str_range[i]);
				// console.log(orgstr);
				str=align_Text(orgstr,_mapping_str);
				editBuilder.replace(str_range[i],str);
			}
		});
	};
}

module.exports={
    create_AlignFnc
}