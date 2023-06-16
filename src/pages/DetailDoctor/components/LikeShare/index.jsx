import React, { useEffect } from 'react'

function LikeShare({ dataHref }) {
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
        <div className="like-share__container">
            <div
                className="fb-like"
                data-href={dataHref}
                data-width=""
                data-layout="standard"
                data-action="like"
                data-size="small"
                data-share="true"
            ></div>
        </div>
    )
}

export default LikeShare
