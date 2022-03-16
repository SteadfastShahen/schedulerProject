let arrOfJobs = []
//let closestTimer = arrOfJobs[0].nextInvocation

function Task ( task, timer, recurrent ) {
    if( !recurrent )
        {
            this.recurrent = false
        }
    this.recurrent = recurrent
    this.timer = timer
    this.timeLeft
    this.task = task
}

function scheduleTask ( task, when, recurrent = false ) {
    let someTask = new Task( task, when, recurrent )
    // 
    let currTimeLeft = 99999999999999999999999999999999999999999999999999
    if( arrOfJobs[0] ) {
        currTimeLeft = arrOfJobs[0].timer
    }
    else {
        arrOfJobs = [ someTask ]
    }
    
    if ( when < currTimeLeft ){
        
        setTimeout( function(){
            someTask.task()
            // subtract waiting time from next task timer
            
            for (let i = 0; i < arrOfJobs.length; i++) {
                arrOfJobs[i].timer -= when - arrOfJobs[i-1].timer || 0
            }
            console.log(arrOfJobs)
            arrOfJobs.shift()

            if( recurrent && !arrOfJobs[0] ){
                scheduleTask( task, when, recurrent )
            }
            if( arrOfJobs[0] ){
                // console.log(arrOfJobs[0].timer)
                // arrOfJobs[1].timer -= someTask.timer
                
                if( recurrent && ( arrOfJobs[0].timer >= when ) ) {
                    
                    console.log('i got here')
                    
                    // for (let i = 0; i < arrOfJobs.length; i++) {
                    //     arrOfJobs[i].timer -= when
                    // }

                    arrOfJobs.shift()
                    scheduleTask( task, when, recurrent )
                }
                else if( !recurrent && arrOfJobs[0].timer < when  ){
                    console.log('i am here')
                    scheduleTask( arrOfJobs[0].task, arrOfJobs[0].timer, arrOfJobs[0].recurrent )
                }
                
            }
            
        }, someTask.timer)
        
    }
    else if( arrOfJobs[0] ){  
        if( when < arrOfJobs[arrOfJobs.length-1].timer ){
            
            let i = 0
            
            while( i < arrOfJobs.length && someTask.timer >= arrOfJobs[i].timer ){
                i++
            }
            arrOfJobs = [  ...[...arrOfJobs].splice( 0, i ) , someTask, ...[...arrOfJobs].splice( i+1, arrOfJobs.length )    ]
            
            console.log(arrOfJobs)
        }
        else{ 
            arrOfJobs = [ ...arrOfJobs, someTask ]
        }
    }
}

let task1 = () => { 
    console.log('task every 5 seconds')
    // console.log(arrOfJobs)  
}
let task2 = () => { 
    console.log('task every 3 seconds')
    // console.log(arrOfJobs) 
}
let task3 = () => { 
    console.log('task once after 7 seconds')
    // console.log(arrOfJobs)  
}


scheduleTask( task1, 5000 )
scheduleTask( task2, 3000 )
scheduleTask( task3, 7000 )