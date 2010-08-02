// Evented animation
(function(originalAnimate, undefined) {
    // Had to "force" triggering of start event, haven't figured out why as of yet.
    var forceTrigger = function(obj, evt, ns, after) {
        setTimeout(function() {
            var bound;
            if ((bound  = $(obj).data('events')) && bound[evt]) {
                for (var i = 0; i < bound[evt].length; i++) 
                    if (bound[evt][i].namespace === ns){
                        bound[evt][i].target = obj;
                        bound[evt][i].handler.call(obj.get(0), bound[evt][i]);                        
                    }
            };
            return after.call(this);
        });
    };
    jQuery.fn.animate = function(prop, opts) {
        if (opts && opts.evented) {
            delete(opts.evented);
            var ctx = this, $it = $(ctx).clearQueue('fx');
            $it.queue(function() {
                forceTrigger.call(ctx, $it, 'start', 'animate',
                function() {
                    $.each(['complete','step'],function(i,fn) {
                        var def = opts[fn];
                        opts[fn] = function() {
                            $it.trigger((fn=='complete'?'end':fn)+'.animate');
                            return def === undefined ? this : def.apply(this,arguments);
                        };
                    });
                    $it.animate(prop, opts);
                });
                $it.dequeue();
            });
            return $it;
        };
        return originalAnimate.apply(this, arguments);
    };
    /*
    $.fn.animateStart = function(fn) {
        if(fn !== undefined) return $.fn.bind.call(this,'start.animate',fn);
        else return $.fn.trigger.call(this,'start.animate');
    };
    $.fn.animateEnd = function(fn) {
        if(fn !== undefined) return $.fn.bind.call(this,'end.animate',fn);
        else return $.fn.trigger.call(this,'end.animate');        
    };
    $.fn.animateStep = function(fn) {
        if(fn !== undefined) return $.fn.bind.call(this,'step.animate',fn);
        else return $.fn.trigger.call(this,'step.animate');        
    };
    */
})($.fn.animate);
