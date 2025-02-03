import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./AccountManagement.module.css";

export const AccountManagement = () => {
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    return (
        <div className={styles.accountPage}>
            {/* Grid Container */}
            <div className={styles.accountGrid}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <h2>My Account</h2>
                    <nav>
                        <ul className={styles.navList}>
                            <li>
                                <a
                                    href="#profile"
                                    className={styles.activeLink}
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="#security">Security</a>
                            </li>
                            <li>
                                <a href="#notifications">Notifications</a>
                            </li>
                            <li>
                                <a href="#billing">Billing</a>
                            </li>
                            <li>
                                <a href="#orders">Orders</a>
                            </li>
                            <li>
                                <a href="#preferences">Preferences</a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    {/* Profile Section */}
                    <section id="profile" className={styles.sectionCard}>
                        <h3>Profile Information</h3>
                        <div className={styles.profileDetails}>
                            <p>
                                <strong>Name:</strong> {currentUser.displayName}
                            </p>
                            <p>
                                <strong>Email:</strong> {currentUser.email}
                            </p>
                            <Link
                                to={`/auth/${userId}/profile-details`}
                                className={styles.editProfileLink}
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section id="security" className={styles.sectionCard}>
                        <h3>Security</h3>
                        <div className={styles.securityGroup}>
                            <p>Change Password</p>
                            <button className={styles.btnPrimary}>
                                Change Password
                            </button>
                        </div>
                        <div className={styles.securityGroup}>
                            <p>Two-Factor Authentication</p>
                            <button className={styles.btnPrimary}>
                                Enable 2FA
                            </button>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section id="notifications" className={styles.sectionCard}>
                        <h3>Notifications</h3>
                        <p>Manage email and push notifications here.</p>
                        <label>
                            <input type="checkbox" /> Email Notifications
                        </label>
                        <label>
                            <input type="checkbox" /> SMS Alerts
                        </label>
                        <label>
                            <input type="checkbox" /> Push Notifications
                        </label>
                        <button className={styles.btnPrimary}>
                            Save Settings
                        </button>
                    </section>

                    {/* Billing Section */}
                    <section id="billing" className={styles.sectionCard}>
                        <h3>Billing</h3>
                        <p>Current Payment Methods:</p>
                        <ul className={styles.paymentList}>
                            <li>Visa **** 1234</li>
                            <li>PayPal: example@paypal.com</li>
                        </ul>
                        <button className={styles.btnPrimary}>
                            Add Payment Method
                        </button>
                        <p>
                            <strong>Subscription Plan:</strong> [Plan Name]
                        </p>
                        <button className={styles.btnPrimary}>
                            Manage Subscription
                        </button>
                    </section>

                    {/* Orders Section */}
                    <section id="orders" className={styles.sectionCard}>
                        <h3>Order History</h3>
                        <p>View your recent orders or downloads here.</p>
                        <ul className={styles.orderList}>
                            <li>Order #1234 - Completed</li>
                            <li>Order #5678 - Processing</li>
                            <li>Order #9101 - Shipped</li>
                        </ul>
                        <button className={styles.btnPrimary}>
                            View All Orders
                        </button>
                    </section>

                    {/* Preferences Section */}
                    <section id="preferences" className={styles.sectionCard}>
                        <h3>Preferences</h3>
                        <p>
                            Language:
                            <select>
                                <option>English</option>
                                <option>Spanish</option>
                            </select>
                        </p>
                        <p>
                            Time Zone:
                            <select>
                                <option>GMT</option>
                                <option>EST</option>
                            </select>
                        </p>
                        <button className={styles.btnPrimary}>
                            Save Preferences
                        </button>
                    </section>

                    {/* Danger Zone Section */}
                    <section className={styles.sectionCard}>
                        <h3>Danger Zone</h3>
                        <p>Delete your account or export your data.</p>
                        <button className={styles.dangerBtn}>
                            Delete Account
                        </button>
                        <button className={styles.btnPrimary}>
                            Export My Data
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
};
