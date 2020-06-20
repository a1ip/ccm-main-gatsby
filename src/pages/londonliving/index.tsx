import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import SpotifyBadge from "../../content/londonliving/badges/Listen_on_spotify.inline.svg"
import ApplePodcastBadge from "../../content/londonliving/badges/US_UK_Apple_Podcasts_Listen_Color_Lockup_RGB_Wht_Type.inline.svg"

import LondonLivingLogo from "../../content/londonliving/LL_logo.inline.svg"

import styles from "../londonliving.module.scss"
import Layout from "../../components/layout"
import HeaderUnderlay from "../../components/header-underlay"
import Section from "../../components/section"
import PodcastEpisode, { Episode } from "./_components/podcast-episode"

type PodcastServiceLink = {
    name: string
    link: string
    type: "ApplePodcasts" | "Spotify"
}

const LondonLivingPage: React.FC<{}> = () => {
    const data = useStaticQuery<GatsbyTypes.LondonLivingQuery>(graphql`
        query LondonLiving {
            mainContent: markdownRemark(
                fileAbsolutePath: { regex: "/londonliving/main.md$/" }
            ) {
                html
                frontmatter {
                    title
                }
            }
            podcast: markdownRemark(
                fileAbsolutePath: { regex: "/londonliving/podcast.md$/" }
            ) {
                frontmatter {
                    links {
                        name
                        link
                        type
                    }
                    seasons {
                        title
                        episodes {
                            title
                            blurb
                            audioUrl
                        }
                    }
                }
            }
        }
    `)

    const episodes = data.podcast!.frontmatter!.seasons!.map((season: any) => {
        const episodes = season.episodes.map((episode: Episode) => (
            <PodcastEpisode key={episode.audioUrl} {...episode} />
        ))
        return (
            <div className={styles.season} key={season.title}>
                <h3>Season {season.title}</h3>
                <div className={styles.episodes}>{episodes}</div>
            </div>
        )
    })

    const links = (data.podcast?.frontmatter?.links ?? []).map((link: any) => {
        let badge = <></>

        switch (link.type) {
            case "ApplePodcasts": {
                badge = <ApplePodcastBadge />
                break
            }
            case "Spotify": {
                badge = <SpotifyBadge />
                break
            }
        }

        return (
            <a
                key={link.link}
                className={styles.linkBadge}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
            >
                {badge}
            </a>
        )
    })

    return (
        <Layout
            headerColour="light"
            title={data.mainContent!.frontmatter!.title}
            description={undefined}
        >
            <HeaderUnderlay className={styles.londonLiving} />
            <Section wider className={styles.londonLiving}>
                <div className={styles.content}>
                    <div className={styles.intro}>
                        <div className={styles.header}>
                            <LondonLivingLogo />
                        </div>
                        <div
                            className={styles.blurb}
                            dangerouslySetInnerHTML={{
                                __html: data.mainContent!.html!,
                            }}
                        />
                        <div className={styles.links}>{links}</div>
                    </div>
                    <div className={styles.podcast}>
                        <div className={styles.seasons}>{episodes}</div>
                    </div>
                </div>
            </Section>
        </Layout>
    )
}

export default LondonLivingPage
