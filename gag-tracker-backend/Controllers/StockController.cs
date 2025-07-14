using gag_tracker_backend.Models;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;

namespace gag_tracker_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<StockController> _logger;

        public StockController(IHttpClientFactory httpClientFactory, ILogger<StockController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockItem>>> GetCurrentStock()
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var response = await httpClient.GetAsync("https://growagardenvalues.com/stock/stocks.php");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var doc = new HtmlDocument();
                doc.LoadHtml(content);

                var stockItems = new List<StockItem>();
                var sections = doc.DocumentNode.SelectNodes("//section[@class='stock-section']");
                
                if (sections != null)
                {
                    foreach (var section in sections)
                    {
                        var categoryNode = section.SelectSingleNode(".//h2");
                        var category = categoryNode?.InnerText.Trim() ?? "Uncategorized";

                        var items = section.SelectNodes(".//div[@class='stock-item']");
                        if (items != null)
                        {
                            foreach (var item in items)
                            {
                                var nameNode = item.SelectSingleNode(".//div[@class='item-name']");
                                var quantityNode = item.SelectSingleNode(".//div[@class='item-quantity']");

                                if (nameNode != null && quantityNode != null)
                                {
                                    var name = nameNode.InnerText.Trim();
                                    var quantityText = quantityNode.InnerText.Trim().Replace("x", "");

                                    if (int.TryParse(quantityText, out int quantity))
                                    {
                                        stockItems.Add(new StockItem
                                        {
                                            Name = name,
                                            Quantity = quantity,
                                            Category = category,
                                            LastUpdated = DateTime.UtcNow
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                return Ok(stockItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current stock");
                return StatusCode(500, "An error occurred while fetching stock data");
            }
        }

        [HttpGet("group")]
        public async Task<ActionResult<IEnumerable<StockItem>>> GetGroupedStock()
        {
            try
            {
                // First get all stock items
                var result = await GetCurrentStock() as ActionResult<IEnumerable<StockItem>>;
                if (result.Result is OkObjectResult okResult && okResult.Value is IEnumerable<StockItem> items)
                {
                    // Then group them
                    var groupedItems = items
                        .GroupBy(item => new { item.Name, item.Category })
                        .Select(group => new StockItem
                        {
                            Name = group.Key.Name,
                            Category = group.Key.Category,
                            Quantity = group.Sum(item => item.Quantity),
                            LastUpdated = DateTime.UtcNow
                        })
                        .ToList();

                    return Ok(groupedItems);
                }

                return StatusCode(500, "Failed to fetch stock items");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting grouped stock");
                return StatusCode(500, "An error occurred while fetching grouped stock data");
            }
        }
    }
}
