frappe.provide('frappe.ui.keys.handlers');

frappe.ui.keys.setup = function() {
	$(window).on('keydown', function(e) {
		var key = frappe.ui.keys.get_key(e);
		if(frappe.ui.keys.handlers[key]) {
			var out = null;
			for(var i=0, l = frappe.ui.keys.handlers[key].length; i<l; i++) {
				var handler = frappe.ui.keys.handlers[key][i];
				var _out = handler.apply(this, [e]);
				if(_out===false) {
					out = _out;
				}
			}
			return out;
		}
	});
}

frappe.ui.keys.get_key = function(e) {
	var keycode = e.keyCode || e.which;
	var key = frappe.ui.keys.key_map[keycode] || String.fromCharCode(keycode);

	if(key.substr(0, 5) === 'Arrow') {
		// ArrowDown -> down
		key = key.substr(5).toLowerCase();
	}
	if(e.ctrlKey || e.metaKey) {
		// add ctrl+ the key
		key = 'ctrl+' + key;
	}
	if(e.shiftKey) {
		// add ctrl+ the key
		key = 'shift+' + key;
	}
	return key.toLowerCase();
}

frappe.ui.keys.on = function(key, handler) {
	if(!frappe.ui.keys.handlers[key]) {
		frappe.ui.keys.handlers[key] = [];
	}
	frappe.ui.keys.handlers[key].push(handler);
}

frappe.ui.keys.on('ctrl+s', function(e) {
	frappe.app.trigger_primary_action();
	e.preventDefault();
	return false;
});

frappe.ui.keys.on('ctrl+g', function(e) {
	$("#navbar-search").focus();
	e.preventDefault();
	return false;
});

frappe.ui.keys.on('ctrl+b', function(e) {
	var route = frappe.get_route();
	if(route[0]==='Form' || route[0]==='List') {
		frappe.new_doc(route[1], true);
		e.preventDefault();
		return false;
	}
});

frappe.ui.keys.on('escape', function(e) {
	close_grid_and_dialog();
});

frappe.ui.keys.on('esc', function(e) {
	close_grid_and_dialog();
});

frappe.ui.keys.on('Enter', function(e) {
	if(cur_dialog && cur_dialog.confirm_dialog) {
		cur_dialog.get_primary_btn().trigger('click');
	}
});

frappe.ui.keys.on('ctrl+down', function(e) {
	var grid_row = frappe.ui.form.get_open_grid_form();
	grid_row && grid_row.toggle_view(false, function() { grid_row.open_next() });
});

frappe.ui.keys.on('ctrl+up', function(e) {
	var grid_row = frappe.ui.form.get_open_grid_form();
	grid_row && grid_row.toggle_view(false, function() { grid_row.open_prev() });
});

frappe.ui.keys.on('shift+ctrl+r', function(e) {
	frappe.ui.toolbar.clear_cache();
});

frappe.ui.keys.key_map = {
	8: 'backspace',
	9: 'tab',
	13: 'enter',
	16: 'shift',
	17: 'ctrl',
	91: 'meta',
	18: 'alt',
	27: 'escape'
}

// keyCode map
frappe.ui.keyCode = {
	ESCAPE: 27,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	ENTER: 13,
	TAB: 9,
	SPACE: 32
}

function close_grid_and_dialog() {
	// close open grid row
	var open_row = $(".grid-row-open");
	if (open_row.length) {
		var grid_row = open_row.data("grid_row");
		grid_row.toggle_view(false);
		return false;
	}

	// close open dialog
	if (cur_dialog && !cur_dialog.no_cancel_flag) {
		cur_dialog.cancel();
		return false;
	}
}