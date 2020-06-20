import React from "react"

import styles from "../../londonliving.module.scss"

export type Season = {
    title: string
    episodes: Episode[]
}

export type Episode = {
    title: string
    audioUrl: string
    blurb: string
}

const PodcastEpisode: React.FC<Episode> = ({ title, audioUrl, blurb }) => (
    <div key={title} className={styles.episode}>
        <h2>{title}</h2>
        <div className={styles.blurb}>
            <p>{blurb}</p>
        </div>
        <div className={styles.media}>
            <div className={styles.audio}>
                <audio controls={true} preload="metadata">
                    <source src={audioUrl} type="audio/mpeg" />
                </audio>
            </div>
        </div>
    </div>
)

export default PodcastEpisode
