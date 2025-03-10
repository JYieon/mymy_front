const initalState={
    Login:{id:"",pwd:""},
    Register:{Id:"",Pwd:"",Name:"",Tel:"",NickName:""},
    RegisterEmail:{Id:"",Pwd:"",Name:"",Email:"",NickName:""},
    Verfiy:{verfiy:""},
    Data:null
};

const reduser=(state,action)=>{
    switch (action.type) {
        case "CHANGE_INPUT":
            // console.log('action:',action,'\nstate',state)
            const form=state[action.form];
            form[action.name]=action.value;
            return {...state,[action.form]:{...form}}
        default:
            return state;
    }
};

export {initalState,reduser};