class Task {
    name: string 
    task: any 
    originalTimer:number
    timer: number
    recurrent: boolean

    constructor ( name: string, task: any, timer: number, recurrent: boolean = false ) {
        this.recurrent = recurrent
        this. originalTimer = timer
        this.timer = timer
        this.name = name
        this.task = task
    }
}

class Queue {
    queue: Task[]
    secondsPast: number
   
    constructor() {
      this.queue = []
      this.secondsPast = 0
    }
   
    addToQueue ( task: Task ) {
        let lastTask = this.queue[ this.queue.length - 1 ]
        if ( !this.queue[0] ) {
            this.queue.push( task )
        }
        else{
            if ( task.timer < this.queue[0].timer ) {
                // this.queue.unshift( task )
                this.queue = [ task, ...this.queue ]
            }
            else if ( lastTask?.timer && ( task.timer >= lastTask.timer ) ) {
                // this.queue.push( task )
                this.queue = [ ...this.queue, task ]
            }
            else {
                let i = 0

                while( i < this.queue.length && task.timer >= this.queue[i].timer ){
                    i++
                }

                this.queue = [  ...[...this.queue].splice( 0, i ) , task, ...[...this.queue].splice( i, this.queue.length )    ]
            }
        }
    }

    removeFromQueue ( task: Task ) {
        this.queue = this.queue.filter( someTask => someTask.name !== task.name )

        let currTimer = task.originalTimer

        setTimeout( () => {
            // console.log(this.queue)
            this.queue = this.queue.filter( someTask => someTask.name !== task.name )
            // console.log(this.queue)
        }, currTimer )
        // wait for [0].timer -> then do this again in case its timeout was already set
            
    }

    executeQueue () {
        if ( this.queue[0] ){
            let currTimer = this.queue[0].timer
            this.secondsPast += currTimer
            // console.log('---------------')
            // console.log(currTimer)

            let toBeDone = this.queue[0].task

            let taskCopy = { ...this.queue[0] }
            taskCopy.timer = taskCopy.originalTimer
            let timeoutID = setTimeout( () => { 

                // if taskCopy === this.queue[0]
                toBeDone() 
                console.log(`seconds past: ${this.secondsPast}`)

                this.queue.shift()
                this.queue.forEach( task => task.timer -= currTimer )

                if( taskCopy.recurrent == true ){
                    // console.log(this.queue)
                    this.addToQueue( taskCopy )
                }
                this.executeQueue()
            }, currTimer )
        }
    }
}

  

let job1 = () => { console.log('task once only after 18 seconds') }

let task = new Task( '7 sec', () => { console.log('task once only after 7 seconds') }, 7000 )
let task1 = new Task( '18 sec', job1, 18000 )
let task2 = new Task( '13 sec', () => { console.log('task once only after 13 seconds') }, 13000 )
let task3 = new Task( '3 sec', () => { console.log('task every 3 seconds') }, 3000, true )
let task4 = new Task( '5 sec', () => { console.log('task every 5 seconds') }, 5000, true )

let queuer = new Queue()
queuer.addToQueue( task )

// console.log('first step')
// console.log(queuer.queue)

queuer.addToQueue( task1 )

// console.log('2nd step')
// console.log(queuer.queue)

queuer.addToQueue( task2 )

// console.log('3rd step')
// console.log(queuer.queue)

queuer.addToQueue( task3 )

// console.log('4th step')
// console.log(queuer.queue)

queuer.addToQueue( task4 )

setTimeout( () => { queuer.removeFromQueue( task3 ) }, 14000 )

queuer.executeQueue()
