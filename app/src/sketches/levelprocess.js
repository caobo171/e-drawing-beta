export  function levelProcess(exp){
    if(exp<=200){
        return 'newbie'
    }else if(exp<=1000){
        return 'specialist'
    }else if(exp<=5000){
        return 'expert'
    }else if(exp<=10000){
        return 'master'
    }else{
        return 'legendary'
    }
}

export  function expLeft(exp){
    if(exp<=200){
        return 200
    }else if(exp<=1000){
        return 1000
    }else if(exp<= 5000){
        return 5000
    }else if (exp<=10000){
        return 0
    }
}