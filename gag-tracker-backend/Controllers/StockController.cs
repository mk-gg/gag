using gag_tracker_backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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
                var response = await httpClient.GetAsync("https://gagstock.gleeze.com/grow-a-garden");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<ApiResponse>(content);

                if (apiResponse?.Status != "success" || apiResponse.Data == null)
                {
                    return StatusCode(500, "Invalid response from API");
                }

                var stockItems = new List<StockItem>();

                // Process each category
                ProcessCategory(stockItems, apiResponse.Data.Egg, "Egg");
                ProcessCategory(stockItems, apiResponse.Data.Seed, "Seed");
                ProcessCategory(stockItems, apiResponse.Data.Gear, "Gear");
                ProcessCategory(stockItems, apiResponse.Data.Cosmetics, "Cosmetics");
                ProcessCategory(stockItems, apiResponse.Data.Honey, "Honey");

                return Ok(stockItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current stock");
                return StatusCode(500, "An error occurred while fetching stock data");
            }
        }

        private void ProcessCategory(List<StockItem> stockItems, StockCategory category, string categoryName)
        {
            foreach (var item in category.Items)
            {
                stockItems.Add(new StockItem
                {
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Category = categoryName,
                    Emoji = item.Emoji,
                    Countdown = category.Countdown,
                    LastUpdated = DateTime.UtcNow
                });
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
                            Emoji = group.First().Emoji,
                            Countdown = group.First().Countdown,
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
