import Product from "../../models/Product.js";

export const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;

        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Keyword is required and must be in string format",
            })
        }

        // Normalize and tokenize the search query
        const normalizedKeyword = keyword.trim().toLowerCase();
        const searchTerms = normalizedKeyword.split(/\s+/).filter(term => term.length > 0);

        // Build search queries for each term
        const searchQueries = searchTerms.map(term => {
            const regEx = new RegExp(term, "i");
            return {
                $or: [
                    { title: regEx },
                    { description: regEx },
                    { category: regEx },
                    { brand: regEx },
                ]
            };
        });

        // Match products that contain ANY of the search terms
        const createSearchQuery = searchQueries.length > 0
            ? { $or: searchQueries.map(q => q.$or).flat() }
            : {};

        // Also create a query for products matching ALL terms (more relevant)
        const allTermsQuery = searchQueries.length > 0
            ? { $and: searchQueries }
            : {};

        // Get all matching products
        let searchResults = await Product.find(createSearchQuery).lean();

        // Score and sort results by relevance
        searchResults = searchResults.map(product => {
            let score = 0;
            const titleLower = (product.title || '').toLowerCase();
            const descLower = (product.description || '').toLowerCase();
            const categoryLower = (product.category || '').toLowerCase();
            const brandLower = (product.brand || '').toLowerCase();

            searchTerms.forEach(term => {
                // Exact title match - highest priority
                if (titleLower === term) score += 100;
                // Title starts with term
                else if (titleLower.startsWith(term)) score += 50;
                // Title contains term
                else if (titleLower.includes(term)) score += 30;

                // Brand match
                if (brandLower.includes(term)) score += 25;

                // Category match
                if (categoryLower.includes(term)) score += 20;

                // Description match - lower priority
                if (descLower.includes(term)) score += 5;
            });

            // Bonus for matching multiple terms
            const matchedTerms = searchTerms.filter(term =>
                titleLower.includes(term) ||
                descLower.includes(term) ||
                categoryLower.includes(term) ||
                brandLower.includes(term)
            );
            score += matchedTerms.length * 10;

            return { ...product, _relevanceScore: score };
        });

        // Sort by relevance score (highest first)
        searchResults.sort((a, b) => b._relevanceScore - a._relevanceScore);

        // Remove the score from results (optional, but cleaner)
        searchResults = searchResults.map(({ _relevanceScore, ...product }) => product);

        res.status(200).json({
            success: true,
            data: searchResults,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error!",
        })
    }
}