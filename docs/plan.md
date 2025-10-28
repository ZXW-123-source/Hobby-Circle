# Hobby Circle — Understanding of the Webpage

## Overview
This webpage describes a social platform that connects people by shared hobbies. It allows users to create and join interest-based circles, post updates (text and images) within those circles, and receive recommendations for circles and users based on interest tags.

## Key Features
- Circle management: create, browse, join, and leave interest circles (e.g., photography, reading, sports).
- Posts within circles: support for text updates and image attachments; likely includes timestamps and author info.
- Recommendations: suggest similar circles and users using interest tags and simple similarity matching.
- Basic social interactions: follow users, like or comment on posts (implied feature set).

## Primary User Flows
1. Discover circles via search or recommended list.
2. Join a circle and view the circle feed.
3. Create a post (text + images) targeted at a specific circle.
4. Interact with posts (like, comment) and follow users.
5. Receive personalized recommendations based on chosen tags and activity.

## Suggested Data Model (high level)
- User: id, username, profile, interests (tags), follows
- Circle: id, name, description, tags, members
- Post: id, author_id, circle_id, text, images[], created_at, likes_count, comments_count
- Recommendation: tag-based scores, collaborative signals

## UX / Technical Considerations
- Image upload and storage (CDN or object storage); resize/optimize on upload.
- Privacy and moderation: content reporting, member management, visibility settings.
- Scalability: index circles by tags, cache popular feeds, paginate feeds.
- Recommendation basics: tag overlap, co-membership, and simple collaborative filtering as a start.

## Next Steps / Minimal Viable Product (MVP)
- Implement user sign-up and profile with interest tags.
- Circle creation and join workflow.
- Feed with posting (text + images) and basic interactions.
- Simple tag-based recommendation engine.

## Change Log

- 2025-10-26: Frontend hero/background and UX improvements
	- Made the hero section occupy the full viewport (height: 100vh) for a stronger landing impression.
	- Converted the hero image to a responsive background with `background-size: cover` and added a gradient overlay for text contrast.
	- Moved the intro box to the left-bottom of the hero and added a semi-transparent background to guarantee readability.
	- Added interactive enhancements: CTA smooth scroll to the next section, lightweight parallax background movement, card hover effects and reveal-on-scroll animations (IntersectionObserver).
	- Added reduced-motion support and minor responsive adjustments for small screens.

These are implementation-level, non-breaking visual improvements to the static demo homepage. Verify on desktop/tablet/mobile and replace hero images with optimized WebP/AVIF variants for production.

## 2025-10-26 — Additional updates

- Added metadata to Popular Circles cards (tag badges and member counts) to improve discoverability on the homepage.
- Updated header navigation and added three demo subpages: `circles.html`, `feed.html`, and `signup.html`.
	- `circles.html` includes a simple create form and a browse section for circles.
	- `feed.html` contains a demo community feed with sample posts.
	- `signup.html` provides a simple sign-up form and interest input.

These pages are static demo placeholders based on the product concept; they are meant to be extended into dynamic routes later.

## Responsive hero images (next step)

- A responsive WebP background was wired into `index.html` via media queries. To enable it fully, add the following files into your `images/` folder:
	- `hero-large.webp` — desktop (recommended width ~1800–2400px)
	- `hero-medium.webp` — tablet (recommended width ~1000–1400px)
	- `hero-small.webp` — mobile (recommended width ~640–900px)

- If these WebP files are not present, `index.html` will fall back to the existing `images/hero.jpg`.
- For production, generate WebP/AVIF from your original image and compress (quality 60–80%), and keep JPG/PNG fallbacks if you need maximum compatibility.
