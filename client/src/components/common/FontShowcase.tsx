import { fontClasses } from '@/lib/utils/fonts';
import { cn } from '@/lib/cn';

/**
 * FontShowcase - Test component to verify all fonts and weights are working
 * 
 * Usage: Import this component in your app to see all font styles
 */
export const FontShowcase = () => {
    return (
        <div className="container mx-auto p-8 space-y-12">
            <div>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">Font System Showcase</h2>
            </div>

            {/* Font Families */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Font Families</h3>

                <div className="space-y-2">
                    <p className="font-sans text-lg">
                        <span className="font-semibold">Sans (Outfit):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-heading text-lg">
                        <span className="font-semibold">Heading (Inter):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-mono text-lg">
                        <span className="font-semibold">Mono (JetBrains):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-serif text-lg">
                        <span className="font-semibold">Serif (Georgia):</span> The quick brown fox jumps over the lazy dog
                    </p>
                </div>
            </section>

            {/* Font Weights */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Font Weights (Outfit)</h3>

                <div className="space-y-2">
                    <p className="font-sans font-light text-lg">
                        <span className="font-semibold">Light (300):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-sans font-normal text-lg">
                        <span className="font-semibold">Normal (400):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-sans font-medium text-lg">
                        <span className="font-semibold">Medium (500):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-sans font-semibold text-lg">
                        <span className="font-bold">Semibold (600):</span> The quick brown fox jumps over the lazy dog
                    </p>
                    <p className="font-sans font-bold text-lg">
                        <span className="font-extrabold">Bold (700):</span> The quick brown fox jumps over the lazy dog
                    </p>
                </div>
            </section>

            {/* Heading Styles */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Heading Styles</h3>

                <div className="space-y-3">
                    <h1 className={fontClasses.h1}>H1 Heading - Main Page Title</h1>
                    <h2 className={fontClasses.h2}>H2 Heading - Section Title</h2>
                    <h3 className={fontClasses.h3}>H3 Heading - Subsection</h3>
                    <h4 className={fontClasses.h4}>H4 Heading - Card Title</h4>
                    <h5 className={fontClasses.h5}>H5 Heading - Small Section</h5>
                    <h6 className={fontClasses.h6}>H6 Heading - Smallest</h6>
                </div>
            </section>

            {/* Body Text Styles */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Body Text Styles</h3>

                <div className="space-y-3">
                    <p className={fontClasses.bodyLarge}>
                        <strong>Body Large:</strong> This is larger body text for emphasis or introductory paragraphs.
                        It's perfect for lead paragraphs or important content.
                    </p>
                    <p className={fontClasses.bodyText}>
                        <strong>Body Text:</strong> This is the standard body text used throughout the application.
                        It's optimized for readability and comfortable reading at length.
                    </p>
                    <p className={fontClasses.bodySmall}>
                        <strong>Body Small:</strong> This is smaller body text for secondary information or
                        compact layouts where space is limited.
                    </p>
                    <p className={fontClasses.caption}>
                        <strong>Caption:</strong> This is caption text for image descriptions, footnotes, or helper text.
                    </p>
                </div>
            </section>

            {/* Button Text */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Button & Label Styles</h3>

                <div className="flex flex-wrap gap-4 items-center">
                    <button className={cn(
                        fontClasses.button,
                        "px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    )}>
                        Standard Button
                    </button>
                    <button className={cn(
                        fontClasses.buttonLarge,
                        "px-6 py-3 bg-primary text-primary-foreground rounded-md"
                    )}>
                        Large Button
                    </button>
                    <label className={fontClasses.label}>
                        Form Label Text
                    </label>
                </div>
            </section>

            {/* Code Text */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Code Style</h3>

                <div className="bg-muted p-4 rounded-md">
                    <code className={fontClasses.code}>
                        const greeting = "Hello, World!";<br />
                        console.log(greeting);
                    </code>
                </div>
            </section>

            {/* Real-world Example */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Real-world Example</h3>

                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className={fontClasses.h2}>Discover the Beauty of Georgia</h2>
                    <p className={cn(fontClasses.bodyLarge, "text-muted-foreground")}>
                        Experience breathtaking landscapes, ancient culture, and warm hospitality
                    </p>
                    <p className={fontClasses.bodyText}>
                        Georgia is a country located at the intersection of Europe and Asia.
                        Known for its diverse landscapes, from the Black Sea beaches to the Caucasus Mountains,
                        Georgia offers visitors a unique blend of natural beauty and rich cultural heritage.
                    </p>
                    <div className="flex gap-4">
                        <button className={cn(
                            fontClasses.button,
                            "px-6 py-2 bg-primary text-primary-foreground rounded-md"
                        )}>
                            Explore Tours
                        </button>
                        <button className={cn(
                            fontClasses.button,
                            "px-6 py-2 border border-border rounded-md"
                        )}>
                            Learn More
                        </button>
                    </div>
                    <p className={fontClasses.caption}>
                        Over 1,000 tours available • Trusted by 50,000+ travelers
                    </p>
                </div>
            </section>
        </div>
    );
};
