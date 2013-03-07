(function(window, undefined) {

    var i,
        cachedruns,
        Expr,
        getText,
        isXML,
        compile,
        outermostContext,
        recompare,
        sortInput,
    // Local document vars
        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,
    // Instance-specific data
        expando = "sizzle" + -(new Date()),
        preferredDoc = window.document,
        support = {},
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        hasDuplicate = false,
        sortOrder = function() {
            return 0;
        },
    // General-purpose constants
        strundefined = typeof undefined,
        MAX_NEGATIVE = 1 << 31,
    // Array methods
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
    //用于判定元素是否在此数组内
        indexOf = arr.indexOf || function(elem) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
                if (this[i] === elem) {
                    return i;
                }
            }
            return -1;
        },
    // Regular expressions

    // 空白的正则 http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",
    // 类选择器与标签选择器的正则 http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
    //ID选择器与标签选择器的正则，HTML5将ID的规则放宽，允许ID可以是纯数字
    // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
    // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace("w", "w#"),
    // 属性选择器的操作符 http://www.w3.org/TR/selectors/#attribute-selectors
        operators = "([*^$|!~]?=)",
    //属性选择器的正则
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
            "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
    // 伪类的正则
        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)",
    // 去掉两端空白正则
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
    //并联选择器的正则
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
    //关系选择器的正则
        rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"),
        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),
        matchExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "NAME": new RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
            "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            //子元素过滤伪类
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            // 位置伪类
            "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        },
        rsibling = /[\x20\t\r\n\f]*[+~]/,
    //取函数的toString判定是否原生API，比如一些库伪造了getElementsByClassName
        rnative = /^[^{]+\{\s*\[native code/,
    //判定选择符是否为单个ID选择器，或标签选择器或类选择器
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    //jQuery自定义的input伪类
        rinputs = /^(?:input|select|textarea|button)$/i,
    //jQuery自定义的header伪类
        rheader = /^h\d$/i,
        rescape = /'|\\/g,
    //用于匹配不带引号的属性值,用于matchesSelector
        rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
    // CSS 字符转义 http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
        funescape = function(_, escaped) {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            return high !== high ? escaped :
                // BMP codepoint
                high < 0 ? String.fromCharCode(high + 0x10000) :
                    // Supplemental Plane codepoint (surrogate pair)
                    String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
        };

    //  将一个NodeList转换为一个纯数组
    try {
        push.apply(
            (arr = slice.call(preferredDoc.childNodes)),
            preferredDoc.childNodes);
        // Support: Android<4.0
        // Detect silently failing push.apply
        arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
        push = {
            apply: arr.length ?
                // Leverage slice if possible

                function(target, els) {
                    push_native.apply(target, slice.call(els));
                } :
                // IE6-8只能逐个遍历加入

                function(target, els) {
                    var j = target.length,
                        i = 0;
                    // Can't trust NodeList.length
                    while ((target[j++] = els[i++])) {}
                    target.length = j - 1;
                }
        };
    }

    function isNative(fn) {
        return rnative.test(fn + "");
    }


    //创建一个缓存函数,它以自己为储存仓库,键名放到闭包内的一个数组内,当数组的个数超过
    //Expr.cacheLength时,则去掉最前面的键值

    function createCache() {
        var cache,
            keys = [];
        return (cache = function(key, value) {
            //对键名进行改造,防止与Object.prototype的原生方法重名,比如toString, valueOf th native prototype properties (see Issue #157)
            if (keys.push(key += " ") > Expr.cacheLength) {
                // Only keep the most recent entries
                delete cache[keys.shift()];
            }
            return (cache[key] = value);
        });
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */

    function markFunction(fn) {
        fn[expando] = true;
        return fn;
    }


    //用于做各种特征检测，比如是否支持某个API，API支持是否完美

    function assert(fn) {
        var div = document.createElement("div");

        try {
            return !!fn(div);
        } catch (e) {
            return false;
        } finally {
            // release memory in IE
            div = null;
        }
    }
    //Sizzle主函数被设计得能递归自身，参数依次是选择符，上下文对象，结果集，种子集
    //除了第一个参数，其他都是可选，上下文对象默认是当前文档对象

    function Sizzle(selector, context, results, seed) {
        var match, elem, m, nodeType,
        // QSA vars
            i, groups, old, nid, newContext, newSelector;
        //如果指定了上下文对象的ownerDocument不等于当前文档对象，覆写所有涉及到document的内部方法
        if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
            setDocument(context);
        }

        context = context || document;
        results = results || [];

        if (!selector || typeof selector !== "string") {
            return results;
        }

        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
            return [];
        }

        if (documentIsHTML && !seed) {

            // Shortcuts
            if ((match = rquickExpr.exec(selector))) {
                // Speed-up: Sizzle("#ID")
                //如果只有一个ID，那么直接getElementById，然后判定其是否在DOM树，
                //元素的ID确实为目标值就将它合并到结果集中
                if ((m = match[1])) {
                    if (nodeType === 9) {
                        elem = context.getElementById(m);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if (elem && elem.parentNode) {
                            // Handle the case where IE, Opera, and Webkit return items
                            // by name instead of ID
                            if (elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        } else {
                            return results;
                        }
                    } else {
                        //如果上下文非文档对象，需要用contains函数进行验证
                        if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                            results.push(elem);
                            return results;
                        }
                    }

                    //如果选择符为一个标签选择器
                } else if (match[2]) {
                    push.apply(results, context.getElementsByTagName(selector));
                    return results;

                    //如果选择符为一个类选择器，浏览器又支持getElementsByClassName
                } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                    push.apply(results, context.getElementsByClassName(m));
                    return results;
                }
            }

            // 尝试使用querySelectorAll，并且选择符不存在那些有问题的选择器
            if (!support.qsa && !rbuggyQSA.test(selector)) {
                old = true;
                nid = expando;
                newContext = context;
                newSelector = nodeType === 9 && selector;
                //IE8的querySelectorAll实现存在BUG，它会在包含自己的集合内查找符合自己的元素节点
                //根据规范，应该是当前上下文的所有子孙下找
                //IE8下如果元素节点为Object，无法找到元素

                if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                    groups = tokenize(selector); //将选择符细分N个分组
                    //如果存在ID，则将ID取得出来放到这个分组的最前面，比如div b --> [id=xxx] div b
                    //不存在ID，就创建一个ID，重复上面的操作，但最后会删掉此ID
                    if ((old = context.getAttribute("id"))) {
                        nid = old.replace(rescape, "\\$&");
                    } else {
                        context.setAttribute("id", nid);
                    }
                    nid = "[id='" + nid + "'] ";

                    i = groups.length;
                    while (i--) {
                        groups[i] = nid + toSelector(groups[i]);
                    }
                    newContext = rsibling.test(selector) && context.parentNode || context;
                    newSelector = groups.join(",");
                }

                if (newSelector) {
                    try {
                        push.apply(results,
                            newContext.querySelectorAll(newSelector));
                        return results;
                    } catch (qsaError) {} finally {
                        if (!old) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }
        }

        // 否则去掉两边的空白开始查找
        return select(selector.replace(rtrim, "$1"), context, results, seed);
    }

    /**
     * Detect xml
     * @param {Element|Object} elem An element or a document
     */
    isXML = Sizzle.isXML = function(elem) {
        // documentElement is verified for cases where it doesn't yet exist
        // (such as loading iframes in IE - #4833)
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function(node) {
        var doc = node ? node.ownerDocument || node : preferredDoc;
        //如果文档对象等于当前文档对象，无法确认其文档对象，或没有HTML，直接返回
        //此情况出现机率接近零
        if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
            return document;
        }

        // Set our document
        document = doc;
        docElem = doc.documentElement;

        // 是否为HTML文档
        documentIsHTML = !isXML(doc);

        //判定getElementsByTagName("*")是否只返回元素节点，IE6-8会混杂注释节点
        support.getElementsByTagName = assert(function(div) {
            div.appendChild(doc.createComment(""));
            return !div.getElementsByTagName("*").length;
        });
        //判定浏览器是否区分property与attribute，比如下面测试，multiple为select的一个property
        //只能通过el.xxx这样的方法去取值，若使用getAttribute去取会返回null
        support.attributes = assert(function(div) {
            div.innerHTML = "<select></select>";
            var type = typeof div.lastChild.getAttribute("multiple");
            // IE8 returns a string for some attributes even when not present
            return type !== "boolean" && type !== "string";
        });

        //判定getElementsByClassName值得信任，比如下面测试发现opera9.6不支持第二个类名，
        //safari3.2缓存过度，忘了更新自身
        support.getElementsByClassName = assert(function(div) {
            div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
            if (!div.getElementsByClassName || !div.getElementsByClassName("e").length) {
                return false; //opera9.6
            }
            // Safari 3.2 
            div.lastChild.className = "e";
            return div.getElementsByClassName("e").length === 2;
        });

        // 判定getElementsByName是否可用Check if getElementsByName privileges form controls or returns elements by ID
        // If so, assume (for broader support) that getElementById returns elements by name
        support.getByName = assert(function(div) {
            div.id = expando + 0; //用于检测是否区分name与ID
            // getElementsByName是一个问题多的API，Sizzle原来的注释透露多少东西，
            //因此我在这里补上
            //1 IE6-7下getElementsByName与getElementById都不区分元素的name与ID
            //2 IE的getElementsByName只对表单元素有效，无视拥有相同name值的span div元素
            //3 IE6-7下即使通过document.createElement创建一个表单元素，动态设置name与插入
            //  DOM树，getElementsByName无法找到此元素，innerHTML也不行。一定需要以
            //   document.createElement("<input name="aaa"/>")方式生成元素才行。
            //   同样的情况也发生在iframe上，IE6-7的iframe的name也需要这样同时生成。
            //4 name本来是一个property，但标准浏览器好像已经默认setAttribute("name","xxx")
            //  也能被getElementsByName获取到。
            //5 IE6-8通过innerHTML生成包含name属性的元素时,可能发生无法捕获的错误
            div.appendChild(document.createElement("a")).setAttribute("name", expando);
            div.appendChild(document.createElement("i")).setAttribute("name", expando);
            docElem.appendChild(div);

            // Test
            var pass = doc.getElementsByName &&
                // buggy browsers will return fewer than the correct 2
                doc.getElementsByName(expando).length === 2 +
                    // buggy browsers will return more than the correct 0
                    doc.getElementsByName(expando + 0).length;

            // Cleanup
            docElem.removeChild(div);

            return pass;
        });

        // Support: Webkit<537.32
        // 判定compareDocumentPosition是否可靠
        support.sortDetached = assert(function(div1) {
            return div1.compareDocumentPosition &&
                // Should return 1, but Webkit returns 4 (following)
                (div1.compareDocumentPosition(document.createElement("div")) & 1);
        });

        // 调整IE6-7下获取某些属性的方式，这里只对href, type进行处理
        //实际上，在jQuery里它会被jQuery.attr覆盖
        Expr.attrHandle = assert(function(div) {
            div.innerHTML = "<a href='#'></a>";
            //IE取href, action, src时不会原型返回，会返回其绝对路径
            return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute("href") === "#";
        }) ? {} : {
            "href": function(elem) {
                return elem.getAttribute("href", 2);
            },
            "type": function(elem) {
                return elem.getAttribute("type");
            }
        };

        // ID find and filter
        if (support.getByName) {
            Expr.find["ID"] = function(id, context) {
                //Blackberry 4.6 缓存过度，即便这元素被移出DOM树也能找到
                if (typeof context.getElementById !== strundefined && documentIsHTML) {
                    var m = context.getElementById(id);
                    return m && m.parentNode ? [m] : [];
                }
            };
            Expr.filter["ID"] = function(id) { //过滤器
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            };
        } else {
            Expr.find["ID"] = function(id, context) {
                if (typeof context.getElementById !== strundefined && documentIsHTML) {
                    var m = context.getElementById(id);
                    //1 IE6-7无法区分name与ID，
                    //2 如果form元素的ID为aaa，它下面也有一个name为aaa的INPUT元素，会错误返回INPUT
                    return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [m] : undefined : [];
                }
            };
            Expr.filter["ID"] = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            };
        }

        // Tag
        Expr.find["TAG"] = support.getElementsByTagName ? function(tag, context) {
            if (typeof context.getElementsByTagName !== strundefined) {
                return context.getElementsByTagName(tag);
            }
        } : function(tag, context) {
            var elem,
                tmp = [],
                i = 0,
                results = context.getElementsByTagName(tag);

            // 过滤注释节点
            if (tag === "*") {
                while ((elem = results[i++])) {
                    if (elem.nodeType === 1) {
                        tmp.push(elem);
                    }
                }

                return tmp;
            }
            return results;
        };

        // Name
        Expr.find["NAME"] = support.getByName && function(tag, context) {
            if (typeof context.getElementsByName !== strundefined) {
                return context.getElementsByName(name);
            }
        };

        // Class
        Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
            if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                return context.getElementsByClassName(className);
            }
        };


        rbuggyMatches = [];

        rbuggyQSA = [":focus"];
        //querySelectorAll可以说得上兼容性最差的API，每个浏览器每个版本可能都有差异
        //IE8只支持到CSS2，
        //对于focus伪类,其实现在除opera，safari外，其他浏览器取:focus都正常,
        //但这个东西实在很难在程序来侦测，jQuery选择了一刀切
        if ((support.qsa = isNative(doc.querySelectorAll))) {
            assert(function(div) {
                //对于布尔属性，只要是显式设置了无论值是什么，selected都为false，且通过属性选择器都能选取到
                //这个在IE下有BUG
                div.innerHTML = "<select><option selected=''></option></select>";
                //如果为零，则把常见的布尔属性都放到buggy列表中
                // IE8 - Some boolean attributes are not treated correctly
                if (!div.querySelectorAll("[selected]").length) {
                    rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
                }
                //根据W3C标准,：checked应该包含被选中的option元素，IE8失败
                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                if (!div.querySelectorAll(":checked").length) {
                    rbuggyQSA.push(":checked");
                }
            });

            assert(function(div) {
                //如果属性值为空字符串，那么对于^= $= *=等操作符直接返回false，不会被匹配，opera10-12/IE8都不正确
                div.innerHTML = "<input type='hidden' i=''/>";
                if (div.querySelectorAll("[i^='']").length) {
                    rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')");
                }
                //firefox3.5无法对隐藏元素取:enabled/:disabled伪类，而IE8则直接抛错
                if (!div.querySelectorAll(":enabled").length) {
                    rbuggyQSA.push(":enabled", ":disabled");
                }

                // Opera 10-11对于非法伪类不会抛错 
                div.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
            });
        }
        //判定是否支持matchesSelector，如果不支持，看它是否存在带私有前缀的近亲
        if ((support.matchesSelector = isNative((matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)))) {

            assert(function(div) {
                //IE9缓存过度，能匹配移出DOM树的节点
                support.disconnectedMatch = matches.call(div, "div");
                //Gecko对于非法选择符不会抛错，而是返回false
                matches.call(div, "[s!='']:x");
                rbuggyMatches.push("!=", pseudos);
            });
        }

        rbuggyQSA = new RegExp(rbuggyQSA.join("|"));
        rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
        //重写contains，有原生API就用原生API，否则就遍历DOM树
        contains = isNative(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !! (bup && bup.nodeType === 1 && (
                adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        } : function(a, b) {
            if (b) {
                while ((b = b.parentNode)) {
                    if (b === a) {
                        return true;
                    }
                }
            }
            return false;
        };

        // 重写比较函数
        sortOrder = function(a, b) {
            //略
        }
    };
    //判定这些元素是否匹配expr
    Sizzle.matches = function(expr, elements) {
        return Sizzle(expr, null, null, elements);
    };

    Sizzle.matchesSelector = function(elem, expr) {
        // Set document vars if needed
        if ((elem.ownerDocument || elem) !== document) {
            setDocument(elem);
        }
        //IE9的querySelectorAll要求属性选择器的值必须被引起来
        expr = expr.replace(rattributeQuotes, "='$1']");
        //优化使用原生API
        if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) {
            try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                    return ret;
                }
            } catch (e) {}
        }

        return Sizzle(expr, document, null, [elem]).length > 0;
    };

    Sizzle.contains = function(context, elem) {
        // Set document vars if needed
        if ((context.ownerDocument || context) !== document) {
            setDocument(context);
        }
        return contains(context, elem);
    };

    Sizzle.attr = function(elem, name) {
        var val;

        // Set document vars if needed
        if ((elem.ownerDocument || elem) !== document) {
            setDocument(elem);
        }
        //HTML统一对属性名小写化
        if (documentIsHTML) {
            name = name.toLowerCase();
        }
        if ((val = Expr.attrHandle[name])) {
            return val(elem);
        }
        if (!documentIsHTML || support.attributes) {
            return elem.getAttribute(name);
        }
        return ((val = elem.getAttributeNode(name)) || elem.getAttribute(name)) && elem[name] === true ? name : val && val.specified ? val.value : null;
    };

    Sizzle.error = function(msg) {
        throw new Error("Syntax error, unrecognized expression: " + msg);
    };

    Sizzle.uniqueSort = function(results) {
        //去重排序
        var elem,
            duplicates = [],
            j = 0,
            i = 0;

        // Unless we *know* we can detect duplicates, assume their presence
        hasDuplicate = !support.detectDuplicates;
        // Compensate for sort limitations
        recompare = !support.sortDetached;
        sortInput = !support.sortStable && results.slice(0);
        results.sort(sortOrder);

        if (hasDuplicate) {
            while ((elem = results[i++])) {
                if (elem === results[i]) {
                    j = duplicates.push(i);
                }
            }
            while (j--) {
                results.splice(duplicates[j], 1);
            }
        }

        return results;
    };


    function siblingCheck(a, b) {
        //比较同一个父亲下,两个元素节点的先后顺序
        var cur = b && a,
            diff = cur && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);

        // Use IE sourceIndex if available on both nodes
        if (diff) {
            return diff;
        }
        // Check if b follows a
        if (cur) {
            while ((cur = cur.nextSibling)) {
                if (cur === b) {
                    return -1;
                }
            }
        }

        return a ? 1 : -1;
    }

    //创建一个伪类的过滤函数,此方法是根据表单元素的type值生成
    //比如:radio, :text, :checkbox, :file, :image等自定义伪类

    function createInputPseudo(type) {
        return function(elem) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }

    //创建一个伪类的过滤函数,此方法是根据表单元素的type值或标签类型生成
    //如果:button, :submit自定义伪类

    function createButtonPseudo(type) {
        return function(elem) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }

    //用于创建位置伪类的过滤函数，它们是模拟从左向右的顺序进行选择，
    //匹配到它时的结果集的位置来挑选元素的
    //比如:odd,:even, :eq, :gt, :lt, :first, :last

    function createPositionalPseudo(fn) {
        return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches) {
                var j,
                    matchIndexes = fn([], seed.length, argument),
                    i = matchIndexes.length;

                while (i--) {
                    if (seed[(j = matchIndexes[i])]) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
        //用于:contains伪类，用于匹配当前元素的textConten是否包含目标字符串
        //但对于XML，则需要逐个取得它里面的文本节点，CDATA节点的nodeValue进行拼接了
    getText = Sizzle.getText = function(elem) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;

        if (!nodeType) {
            // If no nodeType, this is expected to be an array
            for (;
                (node = elem[i]); i++) {
                // Do not traverse comment nodes
                ret += getText(node);
            }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {

            if (typeof elem.textContent === "string") {
                return elem.textContent;
            } else {
                // Traverse its children
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText(elem);
                }
            }
        } else if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
        }
        // Do not include comment or processing instruction nodes

        return ret;
    };

    Expr = Sizzle.selectors = {
        // Can be adjusted by the user
        cacheLength: 50,
        createPseudo: markFunction,
        match: matchExpr,
        find: {},
        relative: {
            ">": {
                dir: "parentNode",
                first: true
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: true
            },
            "~": {
                dir: "previousSibling"
            }
        },
        preFilter: {
            //预处理，有的选择器，比如属性选择器与伪类从选择器组分割出来，还要再细分
            //属性选择器要切成属性名，属性值，操作符；伪类要切为类型与传参；
            //子元素过滤伪类还要根据an+b的形式再划分
            "ATTR": function(match) {
                match[1] = match[1].replace(runescape, funescape);

                // Move the given value to match[3] whether quoted or unquoted
                match[3] = (match[4] || match[5] || "").replace(runescape, funescape);

                if (match[2] === "~=") {
                    match[3] = " " + match[3] + " ";
                }

                return match.slice(0, 4);
            },
            "CHILD": function(match) {
                //将它的伪类名称与传参拆分为更细的单元,以数组形式返回
                //比如 ":nth-child(even)"变为
                //["nth","child","even", 2, 0, undefined, undefined, undefined]
            },
            "PSEUDO": function(match) {
                //将它的伪类名称与传参进行再处理
                //比如:contains伪类会去掉两边的引号,反义伪类括号部分会再次提取
            }
        },
        filter: {
            //过滤函数（它们基本上都是curry）
            "TAG": function(nodeName) { //标签选择器
                if (nodeName === "*") {
                    return function() {
                        return true;
                    };
                }

                nodeName = nodeName.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                };
            },
            "CLASS": function(className) { //类选择器，创建一个正则进行匹配
                var pattern = classCache[className + " "];

                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                    return pattern.test(elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "");
                });
            },
            "ATTR": function(name, operator, check) {
                return function(elem) { //属性选择器
                    var result = Sizzle.attr(elem, name);

                    if (result == null) {
                        return operator === "!=";
                    }
                    if (!operator) {
                        return true;
                    }

                    result += "";
                    //这里的三目运算符套嵌得非常复杂，可以参看一下EXT的DOMQuery或mass的Icarus的实现
                    return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                };
            },
            "CHILD": function(type, what, argument, first, last) {
                //这里处理子元素过滤伪类,如:nth-child, :first-child, :only-child
            },
            "PSEUDO": function(pseudo, argument) {
                //这里各种伪类,分派给上方的"CHILD"与下方的"pseudos"去处理
            }
        },
        pseudos: {
            //这里包含各种伪类的过滤函数
            //如:not,:lang,:target,:root,:enabled,:disabled,:checked, :empty(原生伪类)
            //parent, :has,:contains(源自xpath的自定义伪类)
            // :header,:input,:text,:radio,:checkbox,:submit,:reset,
            // :file,:password,:image(自定义标签伪类)
            // :last,:first,:last, :eq, :even, :odd, :lt,:gt(自定义位置伪类)
        }
    };


    function tokenize(selector, parseOnly) {
        var matched, match, tokens, type,
            soFar, groups, preFilters,
            cached = tokenCache[selector + " "];
//先查看缓存了没有
        if (cached) {
            return parseOnly ? 0 : cached.slice(0);
        }
        soFar = selector;
        groups = [];//这是最后要返回的结果，一个二维数组
        //比如"title,div > :nth-child(even)"解析下面的符号流
        // [ [{value:"title",type:"TAG",matches:["title"]}],
        //   [{value:"div",type:["TAG",matches:["div"]},
        //    {value:">", type: ">"},
        //    {value:":nth-child(even)",type:"CHILD",matches:["nth",
        //     "child","even",2,0,undefined,undefined,undefined]}
        //   ] 
        // ]
        //有多少个并联选择器，里面就有多少个数组，数组里面是拥有value与type的对象
        preFilters = Expr.preFilter;
        while (soFar) {
            // 以第一个逗号切割选择符,然后去掉前面的部分
            if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                    // Don't consume trailing commas as valid
                    soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
            }

            matched = false;
            //将刚才前面的部分以关系选择器再进行划分
            if ((match = rcombinators.exec(soFar))) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace(rtrim, " ")
                });
                soFar = soFar.slice(matched.length);
            }
            //将每个选择器组依次用ID,TAG,CLASS,ATTR,CHILD,PSEUDO这些正则进行匹配
            for (type in Expr.filter) {//preFilters是用于分析选择器的名字与参数
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice(matched.length);
                }
            }
            if (!matched) {
                break;
            }
        }
        return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
            // 放到tokenCache函数里进行缓存
            tokenCache(selector, groups).slice(0);
    }

    function toSelector(tokens) {
        var i = 0,//将符合流重新组合成选择符，这时能把多余的空白去掉
            len = tokens.length,
            selector = "";
        for (; i < len; i++) {
            selector += tokens[i].value;
        }
        return selector;
    }

    function addCombinator(matcher, combinator, base) {
        var dir = combinator.dir,
            checkNonElements = base && dir === "parentNode",
            doneName = done++;

        return combinator.first ?
            // Check against closest ancestor/preceding element

            function(elem, context, xml) {
                while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } :
            // Check against all ancestor/preceding elements

            function(elem, context, xml) {
                var data, cache, outerCache,
                    dirkey = dirruns + " " + doneName;

                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                if (xml) {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[expando] || (elem[expando] = {});
                            if ((cache = outerCache[dir]) && cache[0] === dirkey) {
                                if ((data = cache[1]) === true || data === cachedruns) {
                                    return data === true;
                                }
                            } else {
                                cache = outerCache[dir] = [dirkey];
                                cache[1] = matcher(elem, context, xml) || cachedruns;
                                if (cache[1] === true) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
    }

    function elementMatcher(matchers) {
        return matchers.length > 1 ? function(elem, context, xml) {
            var i = matchers.length;
            while (i--) {
                if (!matchers[i](elem, context, xml)) {
                    return false;
                }
            }
            return true;
        } : matchers[0];
    }

    function condense(unmatched, map, filter, context, xml) {
        var elem,
            newUnmatched = [],
            i = 0,
            len = unmatched.length,
            mapped = map != null;

        for (; i < len; i++) {
            if ((elem = unmatched[i])) {
                if (!filter || filter(elem, context, xml)) {
                    newUnmatched.push(elem);
                    if (mapped) {
                        map.push(i);
                    }
                }
            }
        }

        return newUnmatched;
    }

    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function(seed, results, context, xml) {
            var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,
            // Get initial elements from seed or context
                elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
            // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
                matcherOut = matcher ?
                    // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                    postFinder || (seed ? preFilter : preexisting || postFilter) ?
                        // ...intermediate processing is necessary
                        [] :
                        // ...otherwise use results directly
                        results : matcherIn;

            // Find primary matches
            if (matcher) {
                matcher(matcherIn, matcherOut, context, xml);
            }

            // Apply postFilter
            if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);

                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while (i--) {
                    if ((elem = temp[i])) {
                        matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                    }
                }
            }

            if (seed) {
                if (postFinder || preFilter) {
                    if (postFinder) {
                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                        temp = [];
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i])) {
                                // Restore matcherIn since elem is not yet a final match
                                temp.push((matcherIn[i] = elem));
                            }
                        }
                        postFinder(null, (matcherOut = []), temp, xml);
                    }

                    // Move matched elements from seed to results to keep them synchronized
                    i = matcherOut.length;
                    while (i--) {
                        if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {

                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }

                // Add elements to results, through postFinder if defined
            } else {
                matcherOut = condense(
                    matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                if (postFinder) {
                    postFinder(null, results, matcherOut, xml);
                } else {
                    push.apply(results, matcherOut);
                }
            }
        });
    }

    function matcherFromTokens(tokens) {
        //生成用于匹配单个选择器组的函数
    }

    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
        //生成用于匹配单个选择器群组的函数
    }

    compile = Sizzle.compile = function(selector, group /* Internal Use Only */ ) {
        var i,
            setMatchers = [],
            elementMatchers = [],
            cached = compilerCache[selector + " "];

        if (!cached) {
            // Generate a function of recursive functions that can be used to check each element
            if (!group) {
                group = tokenize(selector);
            }
            i = group.length;
            while (i--) {
                //比如div:not(.aaa)跑到这里,group只剩下
                //[[{value:":not(.aaa)",type:"PSEUDO",matches:["not","aaa"]}]
                cached = matcherFromTokens(group[i]);
                if (cached[expando]) {
                    setMatchers.push(cached);
                } else {
                    elementMatchers.push(cached);
                }
            }

            // Cache the compiled function
            cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        }
        return cached;
    };

    function multipleContexts(selector, contexts, results) {
        var i = 0,
            len = contexts.length;
        for (; i < len; i++) {
            Sizzle(selector, contexts[i], results);
        }
        return results;
    }

    function select(selector, context, results, seed) {
        var i, tokens, token, type, find,
            match = tokenize(selector);

        if (!seed) {
            // Try to minimize operations if there is only one group
            if (match.length === 1) {//如果只有一个选择器群组

                tokens = match[0] = match[0].slice(0);
                //如果里面包含ID选择器， 比如#aaa > div
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                    context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {//如果最左边的那个祖先都不存在，那么就不用找下去了
                        return results;
                    }
                    //将最初的选择符去掉ID选择器 --->  " > div"
                    selector = selector.slice(tokens.shift().value.length);
                }
                // Fetch a seed set for right-to-left matching
                i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];

                    // Abort if we hit a combinator
                    if (Expr.relative[(type = token.type)]) {
                        break;
                    }
                    //find查找器有ID,TAG,NAME,CLASS,都是对应原生API,比如div:not(.aaa),div就优先被处理了
                    if ((find = Expr.find[type])) {
                        //如果tokens[0].type为关系选择器,则往上找一级,用其父节点作上下文
                        if ((seed = find(
                            token.matches[0].replace(runescape, funescape),
                            rsibling.test(tokens[0].type) && context.parentNode || context))) {
                            //然后去掉用过的选择器,比如上例中的div
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {//如果选择符为空白,那么将种子集合并到结构集中
                                push.apply(results, seed);
                                return results;
                            }

                            break;
                        }
                    }
                }
            }
        }

        // Compile and execute a filtering function
        // Provide `match` to avoid retokenization if we modified the selector above
        compile(selector, match)(
            seed,
            context, !documentIsHTML,
            results,
            rsibling.test(selector));
        return results;
    }

    // Deprecated
    Expr.pseudos["nth"] = Expr.pseudos["eq"];

    // Easy API for creating new setFilters

    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();


    //判定稳定性
    //http://www.iteye.com/topic/714688
    // Array.prototype.sort在不同浏览器中表现可能不一致。 
    //var arr =[{id:1, value:'a'},{id:1, value:'b'},{id:1, value:'c'}]; 
    //var arr = arr.sort(function(a,b){return b.id-a.id}); 
    //for(var n=0,m=arr.length;n<m;n++){ 
    //  alert(arr[n].value); 
    //} 
    //以上代码在Chrome执行，将得到c,b,a。 
    //而在其他浏览器(IE6/7/8,FF3,Opera10,Safari5)中，得到a,b,c。 
    //不强制参与排序的元素保持原来的顺序（可以不稳定）。实际上Chrome对比较后相等的元素进行了交换操作，而其他的JS引擎没有这么做。 
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

    // Initialize with the default document
    setDocument();

    // Always assume the presence of duplicates if sort doesn't
    // pass them to our comparison function (as in Google Chrome).
    [0, 0].sort(sortOrder);
    support.detectDuplicates = hasDuplicate;

    // EXPOSE
    if (typeof define === "function" && define.amd) {
        define(function() {
            return Sizzle;
        });
    } else {
        window.Sizzle = Sizzle;
    }
    // EXPOSE

})(window);