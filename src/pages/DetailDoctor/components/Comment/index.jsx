import React, { useEffect } from 'react'
import './index.scss'
Comment.propTypes = {}

function Comment({ dataHref }) {
    const initFacebookSDK = () => {
        if (window.FB) {
            window.FB.XFBML.parse()
        }

        window.fbAsyncInit = function () {
            window.FB.init({
                appId: 719375579337227,
                cookie: true,
                xfbml: true,
                version: 'v2.5'
            })
        }
        // Load the SDK asynchronously
        ;(function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) return
            js = d.createElement(s)
            js.id = id
            js.src = '//connect.facebook.net/vi_VN/sdk.js'
            fjs.parentNode.insertBefore(js, fjs)
        })(document, 'script', 'facebook-jssdk')
    }
    useEffect(() => {
        initFacebookSDK()
    }, [])
    return (
        <div className="comment__container">
            <div
                className="fb-comments"
                data-href={dataHref}
                data-width="100%"
                data-numposts="5"
            ></div>
        </div>
    )
}

export default Comment
