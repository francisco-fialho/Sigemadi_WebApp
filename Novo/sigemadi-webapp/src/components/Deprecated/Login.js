import React, { Component } from 'react'

class Login extends Component {

    constructor(props){
        super(props)
        this.onSubmit = this.onSubmit.bind(this) 
    }


    onSubmit(e){
        e.preventDefault()

        this.props.history.push('/auth/roles')

        //criar cookie com as infos do utilizador aqui ou na seleção de roles
    }    

    render() {

        return (
            <div className="card">
                <article className="card-body">
                    <h4 className="card-title text-center mb-4 mt-1">Sign in</h4>
                    <hr />
                    <p className="text-success text-center">Please Sign in</p>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                                </div>
                                <input name="" className="form-control" placeholder="Email or login" type="email" />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                                </div>
                                <input className="form-control" placeholder="******" type="password" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Login  </button>
                        </div>

                    </form>

                </article>
            </div>

        )
    }
}

export default Login

