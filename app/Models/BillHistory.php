<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        "bill_id",
        "history_details",
    ];

    protected $table = "bill_histories";

    public function bill()
    {
        return $this->belongsTo(Bill::class, "bill_id", "id");
    }

    public function getBillHistory()
    {
        $details = json_decode($this->attributes["history_details"]);

        $bill = new Bill();
        $bill->id = $details->id;
        $bill->user_id = $details->user_id;
        $bill->staff_id = $details->staff_id;
        $bill->start_at = $details->start_at;
        $bill->end_at = $details->end_at;
        $bill->user_started_at = $details->user_started_at;
        $bill->completed_at = $details->completed_at;
        $bill->cancel_at = $details->cancel_at;
        $bill->confirmed_at = $details->confirmed_at;
        $bill->adults = $details->adults;
        $bill->children = $details->children;
        $bill->seat_number = isset($details->seat_number) ? $details->seat_number : 0;
        $bill->deleted_at = $details->deleted_at;
        $bill->created_at = $details->created_at;
        $bill->updated_at = $details->updated_at;

        return $bill;
    }
}
