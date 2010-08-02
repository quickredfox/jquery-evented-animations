(function() {
    var node,el,started,ended,stepped,animated,startCTX,endCTX,stepCTX,duration=100;
    function resetDOM() {
        el = node.clone().appendTo(node.parent().empty());
        el.clearQueue('fx').stop().data('events', {});
        started = ended = stepped = animated - false;
        startCTX,endCTX,stepCTX = null;
        onStart = function() {
            started = true;
            startCTX = this;            
        };
        onEnd = function() {
            ended = true;
            endCTX = this;            
        };
        onStep = function() {
            stepped = true;
            stepCTX = this;
        };
        el.unbind('start.animate', onStart);
        el.unbind('end.animate', onEnd);
        el.unbind('step.animate', onStep);
        el.bind('start.animate', onStart);
        el.bind('end.animate', onEnd);
        el.one('step.animate', onStep);
        el.animate({
            top: '100px'
        },
        {
            evented: true,
            duration: duration
        });
    };
    $(function() {
        node = $('#test:first');
        resetDOM();
        module("$.fn.animate() with {evented:true} ");
        
        asyncTest('should animate and stop animating',function() {
            ok(el.is(':animated'), 'element should be animated');
            stop();
            // expect 1 assertion left
            expect(2)
            setTimeout(function() {
                if(ended){
                    ok((el.is(':not(:animated)')), 'element should not be animated when complete is called')                    
                }
                start();
            },duration*2)
        });
        
        asyncTest("should trigger start/step/end events",
        function()
        {
            
            stop();
            // expect 3 assertions left            
            expect(3);
            setTimeout(function() {
                ok(started, 'start.animate event is triggered');
                ok(stepped, 'step.animate event is triggered');              
                ok(ended, 'end.animate event is triggered');
                start();
            },
            duration*2)

        });
        
        asyncTest("should keep \"this\" context in events callbacks",function() {
            stop();
            // expect 3 assertions left            
            expect(3);            
            setTimeout(function() {
                equals(startCTX,el.get(0),"context is kept in start.animate")
                equals(stepCTX,el.get(0),"context is kept in step.animate")                
                equals(endCTX, el.get(0),"context is kept in end.animate")                                
                start();
            },duration*2)
        });
        
    });
})()
