import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <div className={styles["footer-wrapper"]}>
            <div className={styles["left-side"]}>
                <h1 className={styles["footer-text"]}>Eat & Amare, your recipe library.</h1>
                <div className={styles.linksSection}>
                    <h4>Quick Links</h4>
                    <ul className={styles.quickLinksList}>
                        <li className={styles.quickLinkItem}><Link to="/recipes">Recipes</Link></li>
                        <li className={styles.quickLinkItem}><Link to="/about">About Us</Link></li>
                        <li className={styles.quickLinkItem}><Link to="/forum">Forum</Link></li>
                        <li className={styles.quickLinkItem}><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
            </div>
            <div className={styles["right-side"]}>
                <h1 className={styles["footer-text"]}>Enjoy your meal!</h1>
                <div className={styles.socialMediaSection}>
                    <h4>Follow Us</h4>
                    <ul className={styles.socialLinks}>
                        <li className={styles.socialLinkItem}><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li className={styles.socialLinkItem}><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li className={styles.socialLinkItem}><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li className={styles.socialLinkItem}><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
                    </ul>
                </div>
                <div className={styles.newsletterSection}>
                    <h4>Newsletter</h4>
                    <p>Subscribe to get our latest recipes and updates!</p>
                    <form className={styles.newsletterForm}>
                        <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
                        <button type="submit" className={styles.newsletterButton}>Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
