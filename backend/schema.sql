-- ========================================
-- Alumni Influencer Platform DB Schema
-- FINAL VERSION (PRODUCTION READY)
-- ========================================

-- ========================
-- USERS
-- ========================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified TINYINT(1) DEFAULT 0,
  role ENUM('user','developer') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- PROFILES
-- ========================
CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  linkedin_url VARCHAR(255),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id)
);

-- ========================
-- BIDS
-- ========================
CREATE TABLE bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  bid_amount DECIMAL(10,2) NOT NULL,
  bid_date DATE NOT NULL,
  status ENUM('winning','losing','won','lost','cancelled') DEFAULT 'losing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX (profile_id)
);

-- ========================
-- FEATURED ALUMNI
-- ========================
CREATE TABLE featured_alumni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  bid_id INT NOT NULL,
  feature_date DATE NOT NULL,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE,
  INDEX (profile_id),
  INDEX (bid_id)
);

-- ========================
-- CERTIFICATIONS
-- ========================
CREATE TABLE certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  certification_name VARCHAR(255) NOT NULL,
  organisation VARCHAR(255),
  cert_url VARCHAR(255),
  completion_date DATE,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX (profile_id)
);

-- ========================
-- COURSES
-- ========================
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  provider VARCHAR(255),
  course_url VARCHAR(255),
  completion_date DATE,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX (profile_id)
);

-- ========================
-- DEGREES
-- ========================
CREATE TABLE degrees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  degree_name VARCHAR(255) NOT NULL,
  university VARCHAR(255),
  degree_url VARCHAR(255),
  completion_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX (profile_id)
);

-- ========================
-- LICENCES
-- ========================
CREATE TABLE licences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  licence_name VARCHAR(255) NOT NULL,
  authority VARCHAR(255),
  licence_url VARCHAR(255),
  completion_date DATE,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX (profile_id)
);

-- ========================
-- EMPLOYMENT HISTORY
-- ========================
CREATE TABLE employment_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,

  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX (profile_id)
);

-- ========================
-- API KEYS
-- ========================
CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  key_value VARCHAR(255) NOT NULL UNIQUE, 
  is_active TINYINT(1) DEFAULT 1,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used DATETIME,
  revoked_at DATETIME
);

-- ========================
-- EMAIL VERIFICATION TOKENS
-- ========================
CREATE TABLE email_verification_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id),
  INDEX (token)
);

-- ========================
-- PASSWORD RESET TOKENS
-- ========================
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id),
  INDEX (token)
);

-- ========================
-- TOKEN BLACKLIST
-- ========================
CREATE TABLE token_blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX (token(255))
);