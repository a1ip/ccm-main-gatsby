import React, { useState, useEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Cookies from "js-cookie"

const COOKIE_CONSENT_KEY = "ccm_cookie_consent"

type CCMTrackingConsentCookie = "accepted" | "declined" | undefined

const CookieNotice = () => {
    const data = useStaticQuery<GatsbyTypes.CookieNoticeQuery>(graphql`
        query CookieNotice {
            site {
                siteMetadata {
                    cookieNotice
                    googleAnalyticsTrackingID
                }
            }
        }
    `)

    const disableGoogleAnalyticsKey = `ga-disable-${data.site?.siteMetadata?.googleAnalyticsTrackingID}`
    //Disable the tracking by default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any)[disableGoogleAnalyticsKey] = true

    const [consentResponse, setConsentResponse] = useState<
        CCMTrackingConsentCookie
    >(undefined)
    const [isInitialCookieLoaded, setIsInitialCookieLoaded] = useState(false)
    useEffect(() => {
        // @ts-ignore
        const cookie: CCMTrackingConsentCookie = Cookies.get(COOKIE_CONSENT_KEY)
        setConsentResponse(cookie)
        setIsInitialCookieLoaded(true)
    }, [])

    useEffect(() => {
        if (consentResponse != null) {
            Cookies.set(COOKIE_CONSENT_KEY, consentResponse, { expires: 365 })
        }
        if (consentResponse === "accepted") {
            // Enable Google Analytics only if someone opts in.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any)[disableGoogleAnalyticsKey] = false
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(window as any)[disableGoogleAnalyticsKey] = true
        }
    }, [consentResponse, disableGoogleAnalyticsKey])

    // We don't want to show the notice until we've had a chance to read the
    // cookie, otherwise we will get jank from the notice briefly flashing up.
    const showNotice = consentResponse == null && isInitialCookieLoaded === true
    return (
        <div
            id="cookie-notice"
            className="cookie-notice"
            style={showNotice ? { bottom: 0 } : undefined}
            aria-hidden={showNotice === false}
        >
            <div className="notice">
                {data.site!.siteMetadata!.cookieNotice!}
            </div>
            <a
                id="decline-cookie-button"
                className="button decline"
                href="#"
                onClick={() => {
                    setConsentResponse("declined")
                }}
            >
                Decline
            </a>
            <a
                id="accept-cookie-button"
                className="button accept"
                href="#"
                onClick={() => {
                    setConsentResponse("accepted")
                }}
            >
                Accept
            </a>
        </div>
    )
}

export default CookieNotice
