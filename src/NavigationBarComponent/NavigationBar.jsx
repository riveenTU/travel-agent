import "./NavigationBar.css";
import React from "react";

function NavigationBar(props){
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/"><img src="/images/logo.png" alt="Logo" srcset="" /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/"> Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/packages"> Packages</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#about"> About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#contact"> Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}
export default NavigationBar;