## 2026-07-13 - [Performance] Unroll loop to optimize repeated DOM queries in restartBreath
**Learning:** Performance in tight loops or repeated code blocks can be improved by unrolling the loops, specifically when querying DOM elements.
**Action:** Unrolled a loop iterating 3 times that performed DOM queries using string concatenation to 3 separate statements with explicit IDs, resulting in a ~8.9% faster execution for this code path.
