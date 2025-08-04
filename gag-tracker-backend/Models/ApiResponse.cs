using System.Text.Json.Serialization;

namespace gag_tracker_backend.Models
{
    public class ApiResponse
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [JsonPropertyName("data")]
        public ApiData Data { get; set; } = new ApiData();
    }

    public class ApiData
    {
        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [JsonPropertyName("egg")]
        public StockCategory Egg { get; set; } = new StockCategory();

        [JsonPropertyName("seed")]
        public StockCategory Seed { get; set; } = new StockCategory();

        [JsonPropertyName("gear")]
        public StockCategory Gear { get; set; } = new StockCategory();

        [JsonPropertyName("cosmetics")]
        public StockCategory Cosmetics { get; set; } = new StockCategory();

        [JsonPropertyName("honey")]
        public StockCategory Honey { get; set; } = new StockCategory();
    }

    public class StockCategory
    {
        [JsonPropertyName("items")]
        public List<ApiStockItem> Items { get; set; } = new List<ApiStockItem>();

        [JsonPropertyName("countdown")]
        public string Countdown { get; set; } = string.Empty;
    }

    public class ApiStockItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("emoji")]
        public string Emoji { get; set; } = string.Empty;
    }
}
